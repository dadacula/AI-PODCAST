import { Article, Interest, TrendingTopic } from './types';

export const RSS_FEEDS = [
  { url: 'https://feeds.bbci.co.uk/news/rss.xml', category: 'Top Stories' },
  { url: 'http://feeds.bbci.co.uk/news/world/rss.xml', category: 'World' },
  { url: 'http://feeds.bbci.co.uk/news/business/rss.xml', category: 'Business' },
  { url: 'http://feeds.bbci.co.uk/news/politics/rss.xml', category: 'Politics' },
  { url: 'http://feeds.bbci.co.uk/news/health/rss.xml', category: 'Health' },
  { url: 'http://feeds.bbci.co.uk/news/science_and_environment/rss.xml', category: 'Science' },
  { url: 'http://feeds.bbci.co.uk/news/technology/rss.xml', category: 'Technology' },
  { url: 'http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml', category: 'Arts' },
];

const FALLBACK_IMAGES = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCWBtb4b8GJXGRkAyAKYSLg8padcTFx41kIuvb-4qCogDGVgwB410EiiAKF0HdJ7i0WBIVPDH0LtU67htw6iOA3zKuFj71VKmyCe7BBnYbgPCaPGk4pBUTWnEdXZxMJxAH70r9wiwkNg5feUENRlhBLrtsR-A-Gb1LVX2r_Y5zRtJFWBmj5vfSe846kcvuhtUZwKhXiCOff3SmcjbVg3HFA5AD3gU0CJdqWlhdzvssvkBOXqizvmHSRt5g9vuEyf2sqMuzhz3HXdOg',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB0eFq3YJDYGYQrhGdyzIEZ8eVe3pEZzF2p1Ddc1DuC8ZdqRrCdbNqu57TZxqyM711awQ7XT9cz2hvky9uWTyxvl9NyiwFi9pQqeGU3Pvktr71-Bm3eqAsff2Q4oZfnnuhwpUP46T35GkVSn1j2ZSGF_eQLg1NqPFLxmKzFiszxRkC9SK_JBiqWbq7sZjB3pldExMjrlPmcAx8LVafftECxw4GGwuK4Om1dXEuLFZCL6PHs6Bnluo-5Z5o-_yRGsgwKagzHac7acyk',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuClQcgqIV6QRUvzoG25XdWCjf2XDevjoXN0m9mDPPpMubpzMOYY6oULbVZ0QSXaghiQMnL8piMQo-FFdp12uYEePcDf2dwqGCzkWuoFkvVorHKr05E-AfEYKPD09oB1bNL9WVUejrwVbWdE75UM0TQOJQ4KjvS6ZguoXJu9W26Z7lcGWnyhBlTxk8-ePC7TEsMQVrHO_s85NFcM1WY4OOwkXzm88DujNPie9w91l-5XRooWyk22YL9H72K0wKxWk2r92Om-eoULcfo',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBQBsxkjtgXUOU3-jD07h0TtWH_Kip8tdKKSc6A2h3uhu63MX5FXqZHR8qDel_Wuk2pUQ_sXPkWMT3x3wQnKh37ik-FIslhkyYlVoTv4w4cVdZwjo8_SEgf-WtDidssXV2tAjtt4J0SUd4W3vlDxwjRDDtHqgxwXRNZoTKjnyOLuc_i_Tix1kRWIzutqRtx9JCgq1-J4R4dY-5ciVXULGnlvoYLCDn9CQX7RLuYuTE-9p7Xxi85ChenGGy5QOyf8ucufJ3P-88C4VA',
];

export const fetchNews = async (): Promise<Article[]> => {
    const allArticles: Article[] = [];
    const proxyUrl = 'https://corsproxy.io/?';

    const feedsToFetch = RSS_FEEDS; 

    try {
        const promises = feedsToFetch.map(async (feed) => {
            try {
                // BBC English feeds might redirect, corsproxy handles it well
                const response = await fetch(`${proxyUrl}${encodeURIComponent(feed.url)}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const text = await response.text();
                
                const parser = new DOMParser();
                const xml = parser.parseFromString(text, "text/xml");
                const items = xml.querySelectorAll("item");
                
                return Array.from(items).map((item, index) => {
                    const title = item.querySelector("title")?.textContent || "No Title";
                    const description = item.querySelector("description")?.textContent || "";
                    const link = item.querySelector("link")?.textContent || "";
                    const pubDate = item.querySelector("pubDate")?.textContent || new Date().toISOString();
                    const guid = item.querySelector("guid")?.textContent || link;
                    const timestamp = new Date(pubDate).getTime();
                    
                    let imageUrl = '';
                    const thumbnails = item.getElementsByTagName("media:thumbnail");
                    if (thumbnails.length > 0) {
                        imageUrl = thumbnails[0].getAttribute("url") || '';
                    }

                    if (!imageUrl) {
                        imageUrl = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
                    }

                    let timeAgo = 'Today';
                    try {
                        const date = new Date(pubDate);
                        const now = new Date();
                        const diffMs = now.getTime() - date.getTime();
                        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                        if (!isNaN(diffHrs)) {
                            timeAgo = diffHrs > 24 ? `${Math.floor(diffHrs/24)}d ago` : `${Math.max(0, diffHrs)}h ago`;
                        }
                    } catch (e) {
                        console.log('Date parse error', e);
                    }

                    const cleanDesc = description.replace(/<[^>]*>/g, '').trim();

                    return {
                        id: guid,
                        category: feed.category,
                        source: 'BBC News',
                        title: title,
                        readTime: '3m', // placeholder until loaded
                        listenTime: '2m',
                        timeAgo: timeAgo,
                        timestamp: timestamp,
                        imageUrl: imageUrl,
                        content: cleanDesc,
                        link: link,
                        author: 'BBC News',
                        date: new Date(pubDate).toLocaleDateString(),
                    } as Article;
                });
            } catch (err) {
                console.warn(`Failed to fetch feed ${feed.category}`, err);
                return [];
            }
        });

        const results = await Promise.all(promises);
        results.forEach(articles => allArticles.push(...articles));
        
        const seen = new Set();
        const unique = allArticles.filter(el => {
            const duplicate = seen.has(el.id);
            seen.add(el.id);
            return !duplicate;
        });

        // Initial shuffle for variety in Home feed
        return unique.sort(() => Math.random() - 0.5);

    } catch (error) {
        console.error("Error fetching news", error);
        return [];
    }
};

// New function to scrape the full article content
export const fetchFullArticle = async (url: string): Promise<string> => {
    try {
        let htmlText = "";
        
        // Attempt 1: corsproxy.io (Faster, usually works for standard HTML)
        try {
             // Append encoded URL. Some browsers/proxies handle double encoding differently, 
             // but usually encoding the target URL is safest.
             const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
             if (response.ok) {
                 htmlText = await response.text();
             } else {
                 throw new Error("Proxy 1 failed");
             }
        } catch (e) {
            console.warn("Primary proxy failed, switching to fallback...");
            // Attempt 2: allorigins.win (Returns JSON with contents string)
            try {
                const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
                if (response.ok) {
                    const data = await response.json();
                    htmlText = data.contents;
                }
            } catch (innerError) {
                 console.error("All proxies failed", innerError);
            }
        }
        
        if (!htmlText) return "Unable to retrieve content. The source may be blocking external access.";

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, "text/html");

        // BBC-specific structure strategy
        // 1. article p
        // 2. main p
        // 3. specific bbc classes like .ssrcss-1q0x1qg-Paragraph
        // 4. [data-component="text-block"]
        let paragraphs = Array.from(doc.querySelectorAll('main p, article p, [data-component="text-block"], .ssrcss-1q0x1qg-Paragraph, .story-body__inner p'));
        
        // Fallback: Just grab all Ps if we didn't find specific containers
        if (paragraphs.length < 3) {
            paragraphs = Array.from(doc.querySelectorAll('p'));
        }

        const fullText = paragraphs
            .map(p => p.textContent?.trim() || "")
            .filter(text => text.length > 50) // Filter out short snippets, captions, copyright, etc.
            .join("\n\n");

        return fullText || "Content extracted was empty. The page format might be unsupported.";
    } catch (error) {
        console.error("Error fetching full article", error);
        return "Error loading full content. Please check your connection or try again later.";
    }
};

export const INTERESTS: Interest[] = [
  {
    id: 'Top Stories',
    name: 'Top Stories',
    subtitle: 'Global Headlines',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWBtb4b8GJXGRkAyAKYSLg8padcTFx41kIuvb-4qCogDGVgwB410EiiAKF0HdJ7i0WBIVPDH0LtU67htw6iOA3zKuFj71VKmyCe7BBnYbgPCaPGk4pBUTWnEdXZxMJxAH70r9wiwkNg5feUENRlhBLrtsR-A-Gb1LVX2r_Y5zRtJFWBmj5vfSe846kcvuhtUZwKhXiCOff3SmcjbVg3HFA5AD3gU0CJdqWlhdzvssvkBOXqizvmHSRt5g9vuEyf2sqMuzhz3HXdOg'
  },
  {
    id: 'World',
    name: 'World',
    subtitle: 'International',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDckfNuUz3nPrhirGAn0djRllDeXszU8UpEJatBNmJix59I9_CKpv_jtPBuJwHU1M5sp7nZ4dnBbgFBU-O49lKj653cwum1zzPcQqul0TVS0TUHoM-GclZfyq7r-TqrbfghSpZ86G712BiPgRHoUSNFF5lorYAB4DNqh40Nbd56w-LSs3nh9CBwocQCNZojObI2AWzTNlYl2cEDhGB0lu8j_iXW8yz4IHs3agg5YnjRg7O-zAIhetyCYgHsvSB8r4v_jk1-0rL5zc'
  },
  {
    id: 'Business',
    name: 'Business',
    subtitle: 'Economy & Markets',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0SRo1b9LRhfom-h2x-WlGg1cJhVICGOFaqlefSWoQa3Jk9ywdO4q_1_BpHL5VslwJ6GdT_sADdg02-G6Uvv_49ozYcd-5yqvEZMRrl--kiE741eFY9xvw6TWlA6hdO1-cLpkc4O54N4Uz3VTWcqt2BILpvkZcnX8y2aQN3mzZsVtV7b60PtoAvuoPPmkj-7HjaBb1B_aAcKACRhJM7o_leSCgOhE2arLexX3gPw6SRbtjgjoCzXqwdrHtUjz1HrOw-aaRzZ61sH4'
  },
  {
    id: 'Politics',
    name: 'Politics',
    subtitle: 'Policy & Govt',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkvzZ1GxpzXSX2lfoZhhcVQDmNpi4m8JJjUDDQtYSE91hLK-x7sRS1f_Yg8Z0hFTmP1QOvLRkxk_foTRr5bOAVzd6Ve86sptz8oz_uuY-jJEtShe864h9SXqP5lL6PqWHEaAzYzxoCb7xnUXm3dGsH9HKDpBx34erj58UswU2DWw_MQwxm5SKJh0L0GtAdyJGiBQS3KbZ7BvbFlEXRhWx-CQABRSMwHiQKO9nZbTNvZAD6UY34ylsMzU1Hd9OnsJiwfZGRLFnVkz4'
  },
  {
    id: 'Technology',
    name: 'Technology',
    subtitle: 'Tech & Future',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEoj2PbgqauCg8Bn47ewC5i0UY5EYjA4ONPLtj-2pouB1icwI5UjX5IaRQaxSbPj-DLEMdElkW3tPr3Xsy7fH3IHNBTrAOcBKbKz78tHJG-5zi1zEZZgee0ANf-b3VV9kVzgUv0cIy5yoyLIDZaez8ZSD5wF1Pjr5a01bTYxFQMug73YKDZ1lm7fp9nXqLw1-O01EuR14cwSs8NjTB8FADinSS2tR7iwkIzHwANClRLAzThNksXHeD0CBCnpkClSnKvnM6mKEC3Fc'
  },
  {
    id: 'Science',
    name: 'Science',
    subtitle: 'Space & Env',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjOjODw9qOIunrtd9CV4Eoj3K4P8FI7js_a5JJJ1fq1hLb0Rr9JFTvJyA61rh6-1CHZPBd2boUW7E2q7iktTLvrEWyrVNioDhjlIJswgK8z44BNJK7quDanvOjo5n9I66I3t8bdbpyy-yKQWvaDkNuF9bhMhb5yqToll07Sn96gqo9KdBdDH4llDmDf4VNdb_saYC5WxXmBmpSUtMOjV_dekl-YpvXjyeqllRS2UcTBp6XiZtgC2Fb8Cw3oKYHsu8Jgx08ySLXDiU'
  },
  {
    id: 'Arts',
    name: 'Arts',
    subtitle: 'Culture & Film',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmVaBpmZMDn2Bd5MbHCQsXOD5Ey-vmW1ZzBEE4EcDW-ayoX9XAgORhW4c2Ygci8Os7O_d_AW3nvnfLOgcbMvm4yigNNf1hsf8jPJGi9klbWbbl8OIKJ4zi1zenmwqjWdXFhmCiWm-WRW_uYPZMzzQm5svh1xlDx8KxEqfZ7nKE-LHYduEDMtEfrmthgfyO86XazkyXzYAqX0O6VXQ1ZP_0qWZdH1l9tSSsodBuj-8Lj9QNoydO81sr1hJS8NqXSMHTZH7MVgAHg6k'
  },
  {
    id: 'Health',
    name: 'Health',
    subtitle: 'Wellness',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0eFq3YJDYGYQrhGdyzIEZ8eVe3pEZzF2p1Ddc1DuC8ZdqRrCdbNqu57TZxqyM711awQ7XT9cz2hvky9uWTyxvl9NyiwFi9pQqeGU3Pvktr71-Bm3eqAsff2Q4oZfnnuhwpUP46T35GkVSn1j2ZSGF_eQLg1NqPFLxmKzFiszxRkC9SK_JBiqWbq7sZjB3pldExMjrlPmcAx8LVafftECxw4GGwuK4Om1dXEuLFZCL6PHs6Bnluo-5Z5o-_yRGsgwKagzHac7acyk'
  },
];

export const ARTICLES: Article[] = []; 

export const TRENDING: TrendingTopic[] = [
  { id: 1, rank: '#01', name: 'Economy', volume: '+24% volume', path: 'M0,15 Q10,18 20,10 T40,5' },
  { id: 2, rank: '#02', name: 'Politics', volume: '+18% volume', path: 'M0,10 L10,12 L20,8 L30,5 L40,2' },
  { id: 3, rank: '#03', name: 'Climate', volume: '+12% volume', path: 'M0,18 L15,15 L25,10 L40,8' },
  { id: 4, rank: '#04', name: 'Science', volume: '+8% volume', path: 'M0,12 Q15,5 25,12 T40,10' },
];

export const HISTORY = [
    "Artificial Intelligence", "Monetary Policy", "Architecture Weekly"
];