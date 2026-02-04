import { Article, Interest, TrendingTopic } from './types';

// BBC RSS feeds are blocked by network restrictions (403 host_not_allowed)
// Using curated tech blogs from HN Popular Blogs 2025 instead
export const RSS_FEEDS = [
  // AI & Machine Learning
  { url: 'https://garymarcus.substack.com/feed', category: 'AI & ML' },
  { url: 'https://simonwillison.net/atom/everything/', category: 'AI & ML' },
  { url: 'https://minimaxir.com/index.xml', category: 'AI & ML' },

  // Security & Privacy
  { url: 'https://krebsonsecurity.com/feed/', category: 'Security' },
  { url: 'https://lcamtuf.substack.com/feed', category: 'Security' },
  { url: 'https://www.troyhunt.com/rss/', category: 'Security' },
  { url: 'https://micahflee.com/feed/', category: 'Security' },
  { url: 'https://mjg59.dreamwidth.org/data/rss', category: 'Security' },

  // Programming & Development
  { url: 'https://matklad.github.io/feed.xml', category: 'Programming' },
  { url: 'https://mitchellh.com/feed.xml', category: 'Programming' },
  { url: 'https://eli.thegreenplace.net/feeds/all.atom.xml', category: 'Programming' },
  { url: 'https://bernsteinbear.com/feed.xml', category: 'Programming' },
  { url: 'https://borretti.me/feed.xml', category: 'Programming' },
  { url: 'https://jyn.dev/atom.xml', category: 'Programming' },
  { url: 'https://beej.us/blog/rss.xml', category: 'Programming' },

  // Web Development
  { url: 'https://overreacted.io/rss.xml', category: 'Web Dev' },
  { url: 'https://blog.jim-nielsen.com/feed.xml', category: 'Web Dev' },
  { url: 'https://www.geoffreylitt.com/feed.xml', category: 'Web Dev' },
  { url: 'https://evanhahn.com/feed.xml', category: 'Web Dev' },
  { url: 'https://blog.miguelgrinberg.com/feed', category: 'Web Dev' },

  // System Design & Architecture
  { url: 'https://rachelbythebay.com/w/atom.xml', category: 'Systems' },
  { url: 'https://lucumr.pocoo.org/feed.atom', category: 'Systems' },
  { url: 'https://michael.stapelberg.ch/feed.xml', category: 'Systems' },
  { url: 'https://berthub.eu/articles/index.xml', category: 'Systems' },
  { url: 'https://utcc.utoronto.ca/~cks/space/blog/?atom', category: 'Systems' },

  // Hardware & Electronics
  { url: 'https://www.righto.com/feeds/posts/default', category: 'Hardware' },
  { url: 'https://fabiensanglard.net/rss.xml', category: 'Hardware' },
  { url: 'https://www.downtowndougbrown.com/feed/', category: 'Hardware' },
  { url: 'https://www.jeffgeerling.com/blog.xml', category: 'Hardware' },

  // Business & Startups
  { url: 'https://www.construction-physics.com/feed', category: 'Business' },
  { url: 'https://steveblank.com/feed/', category: 'Business' },
  { url: 'https://www.dwarkeshpatel.com/feed', category: 'Business' },
  { url: 'https://keygen.sh/blog/feed.xml', category: 'Business' },

  // Science & Research
  { url: 'https://www.johndcook.com/blog/feed/', category: 'Science' },
  { url: 'https://dynomight.net/feed.xml', category: 'Science' },
  { url: 'https://www.experimental-history.com/feed', category: 'Science' },
  { url: 'https://gwern.substack.com/feed', category: 'Science' },

  // Technology Commentary & Culture
  { url: 'https://daringfireball.net/feeds/main', category: 'Tech Culture' },
  { url: 'https://pluralistic.net/feed/', category: 'Tech Culture' },
  { url: 'https://www.wheresyoured.at/rss/', category: 'Tech Culture' },
  { url: 'https://anildash.com/feed.xml', category: 'Tech Culture' },
  { url: 'https://joanwestenberg.com/rss', category: 'Tech Culture' },
  { url: 'https://xeiaso.net/blog.rss', category: 'Tech Culture' },

  // Retro Computing & Digital History
  { url: 'https://www.filfre.net/feed/', category: 'Digital History' },
  { url: 'https://oldvcr.blogspot.com/feeds/posts/default', category: 'Digital History' },
  { url: 'https://www.abortretry.fail/feed', category: 'Digital History' },
  { url: 'https://computer.rip/rss.xml', category: 'Digital History' },
  { url: 'https://dfarq.homeip.net/feed/', category: 'Digital History' },

  // Microsoft & Windows Development
  { url: 'https://devblogs.microsoft.com/oldnewthing/feed', category: 'Windows Dev' },

  // General Tech & Programming Blogs
  { url: 'https://www.seangoedecke.com/rss.xml', category: 'Technology' },
  { url: 'https://shkspr.mobi/blog/feed/', category: 'Technology' },
  { url: 'https://skyfall.dev/rss.xml', category: 'Technology' },
  { url: 'https://nesbitt.io/feed.xml', category: 'Technology' },
  { url: 'https://terriblesoftware.org/feed/', category: 'Technology' },
  { url: 'https://gilesthomas.com/feed/rss.xml', category: 'Technology' },
  { url: 'https://xania.org/feed', category: 'Technology' },
  { url: 'https://susam.net/feed.xml', category: 'Technology' },
  { url: 'https://entropicthoughts.com/feed.xml', category: 'Technology' },
  { url: 'https://buttondown.com/hillelwayne/rss', category: 'Technology' },
  { url: 'https://jayd.ml/feed.xml', category: 'Technology' },
  { url: 'https://geohot.github.io/blog/feed.xml', category: 'Technology' },
  { url: 'http://www.aaronsw.com/2002/feeds/pgessays.rss', category: 'Technology' },
  { url: 'https://brutecat.com/rss.xml', category: 'Technology' },
  { url: 'https://www.chiark.greenend.org.uk/~sgtatham/quasiblog/feed.xml', category: 'Technology' },
  { url: 'https://feed.tedium.co/', category: 'Technology' },
  { url: 'https://danielchasehooper.com/feed.xml', category: 'Technology' },
  { url: 'https://martinalderson.com/feed.xml', category: 'Technology' },
];

const FALLBACK_IMAGES = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCWBtb4b8GJXGRkAyAKYSLg8padcTFx41kIuvb-4qCogDGVgwB410EiiAKF0HdJ7i0WBIVPDH0LtU67htw6iOA3zKuFj71VKmyCe7BBnYbgPCaPGk4pBUTWnEdXZxMJxAH70r9wiwkNg5feUENRlhBLrtsR-A-Gb1LVX2r_Y5zRtJFWBmj5vfSe846kcvuhtUZwKhXiCOff3SmcjbVg3HFA5AD3gU0CJdqWlhdzvssvkBOXqizvmHSRt5g9vuEyf2sqMuzhz3HXdOg=w1200',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB0eFq3YJDYGYQrhGdyzIEZ8eVe3pEZzF2p1Ddc1DuC8ZdqRrCdbNqu57TZxqyM711awQ7XT9cz2hvky9uWTyxvl9NyiwFi9pQqeGU3Pvktr71-Bm3eqAsff2Q4oZfnnuhwpUP46T35GkVSn1j2ZSGF_eQLg1NqPFLxmKzFiszxRkC9SK_JBiqWbq7sZjB3pldExMjrlPmcAx8LVafftECxw4GGwuK4Om1dXEuLFZCL6PHs6Bnluo-5Z5o-_yRGsgwKagzHac7acyk=w1200',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuClQcgqIV6QRUvzoG25XdWCjf2XDevjoXN0m9mDPPpMubpzMOYY6oULbVZ0QSXaghiQMnL8piMQo-FFdp12uYEePcDf2dwqGCzkWuoFkvVorHKr05E-AfEYKPD09oB1bNL9WVUejrwVbWdE75UM0TQOJQ4KjvS6ZguoXJu9W26Z7lcGWnyhBlTxk8-ePC7TEsMQVrHO_s85NFcM1WY4OOwkXzm88DujNPie9w91l-5XRooWyk22YL9H72K0wKxWk2r92Om-eoULcfo=w1200',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBQBsxkjtgXUOU3-jD07h0TtWH_Kip8tdKKSc6A2h3uhu63MX5FXqZHR8qDel_Wuk2pUQ_sXPkWMT3x3wQnKh37ik-FIslhkyYlVoTv4w4cVdZwjo8_SEgf-WtDidssXV2tAjtt4J0SUd4W3vlDxwjRDDtHqgxwXRNZoTKjnyOLuc_i_Tix1kRWIzutqRtx9JCgq1-J4R4dY-5ciVXULGnlvoYLCDn9CQX7RLuYuTE-9p7Xxi85ChenGGy5QOyf8ucufJ3P-88C4VA=w1200',
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

                    // Try to get the highest quality image available
                    // First check media:content (often higher quality than thumbnail)
                    const mediaContent = item.getElementsByTagName("media:content");
                    if (mediaContent.length > 0) {
                        imageUrl = mediaContent[0].getAttribute("url") || '';
                    }

                    // Fallback to media:thumbnail if no media:content
                    if (!imageUrl) {
                        const thumbnails = item.getElementsByTagName("media:thumbnail");
                        if (thumbnails.length > 0) {
                            imageUrl = thumbnails[0].getAttribute("url") || '';
                        }
                    }

                    // Optimize BBC image URLs for higher resolution
                    if (imageUrl && (imageUrl.includes('bbci.co.uk') || imageUrl.includes('bbc.co.uk'))) {
                        // BBC standard sizes: 240, 464, 624, 800, 976 (width)
                        // Request 976x549 which is reliably available on BBC CDN
                        imageUrl = imageUrl
                            .replace(/_\d+x\d+\./g, '_976x549.')    // Use 976x549 (16:9 HD-ready)
                            .replace(/_\d+x\d+$/g, '_976x549')      // Handle URLs without extension
                            .replace(/_\d+\./, '_976.')             // Handle width-only format
                            .replace('/cpsprodpb/', '/cpsproduction/') // Use production servers
                            .replace('$recipe', '$recipe_976x549');  // BBC recipe parameter
                    }

                    // Use fallback images if no image found
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

                    // Calculate read time (average reading speed: 238 words per minute)
                    const wordCount = (title + ' ' + cleanDesc).split(/\s+/).length;
                    const readMinutes = Math.max(1, Math.ceil(wordCount / 238));
                    const readTime = `${readMinutes}m`;

                    // Calculate listen time (speech synthesis: ~150 words per minute)
                    const listenMinutes = Math.max(1, Math.ceil(wordCount / 150));
                    const listenTime = `${listenMinutes}m`;

                    // Optimize image URL for higher resolution
                    let optimizedImageUrl = imageUrl;
                    if (imageUrl.includes('googleusercontent.com')) {
                        // Add size parameter for higher resolution (1200px wide)
                        optimizedImageUrl = imageUrl.includes('=')
                            ? `${imageUrl.split('=')[0]}=w1200`
                            : `${imageUrl}=w1200`;
                    }

                    return {
                        id: guid,
                        category: feed.category,
                        source: 'BBC News',
                        title: title,
                        readTime: readTime,
                        listenTime: listenTime,
                        timeAgo: timeAgo,
                        timestamp: timestamp,
                        imageUrl: optimizedImageUrl,
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
    id: 'AI & ML',
    name: 'AI & ML',
    subtitle: 'Artificial Intelligence',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWBtb4b8GJXGRkAyAKYSLg8padcTFx41kIuvb-4qCogDGVgwB410EiiAKF0HdJ7i0WBIVPDH0LtU67htw6iOA3zKuFj71VKmyCe7BBnYbgPCaPGk4pBUTWnEdXZxMJxAH70r9wiwkNg5feUENRlhBLrtsR-A-Gb1LVX2r_Y5zRtJFWBmj5vfSe846kcvuhtUZwKhXiCOff3SmcjbVg3HFA5AD3gU0CJdqWlhdzvssvkBOXqizvmHSRt5g9vuEyf2sqMuzhz3HXdOg=w1200'
  },
  {
    id: 'Security',
    name: 'Security',
    subtitle: 'Cybersecurity & Privacy',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDckfNuUz3nPrhirGAn0djRllDeXszU8UpEJatBNmJix59I9_CKpv_jtPBuJwHU1M5sp7nZ4dnBbgFBU-O49lKj653cwum1zzPcQqul0TVS0TUHoM-GclZfyq7r-TqrbfghSpZ86G712BiPgRHoUSNFF5lorYAB4DNqh40Nbd56w-LSs3nh9CBwocQCNZojObI2AWzTNlYl2cEDhGB0lu8j_iXW8yz4IHs3agg5YnjRg7O-zAIhetyCYgHsvSB8r4v_jk1-0rL5zc=w1200'
  },
  {
    id: 'Programming',
    name: 'Programming',
    subtitle: 'Software Development',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEoj2PbgqauCg8Bn47ewC5i0UY5EYjA4ONPLtj-2pouB1icwI5UjX5IaRQaxSbPj-DLEMdElkW3tPr3Xsy7fH3IHNBTrAOcBKbKz78tHJG-5zi1zEZZgee0ANf-b3VV9kVzgUv0cIy5yoyLIDZaez8ZSD5wF1Pjr5a01bTYxFQMug73YKDZ1lm7fp9nXqLw1-O01EuR14cwSs8NjTB8FADinSS2tR7iwkIzHwANClRLAzThNksXHeD0CBCnpkClSnKvnM6mKEC3Fc=w1200'
  },
  {
    id: 'Web Dev',
    name: 'Web Dev',
    subtitle: 'Frontend & Backend',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkvzZ1GxpzXSX2lfoZhhcVQDmNpi4m8JJjUDDQtYSE91hLK-x7sRS1f_Yg8Z0hFTmP1QOvLRkxk_foTRr5bOAVzd6Ve86sptz8oz_uuY-jJEtShe864h9SXqP5lL6PqWHEaAzYzxoCb7xnUXm3dGsH9HKDpBx34erj58UswU2DWw_MQwxm5SKJh0L0GtAdyJGiBQS3KbZ7BvbFlEXRhWx-CQABRSMwHiQKO9nZbTNvZAD6UY34ylsMzU1Hd9OnsJiwfZGRLFnVkz4=w1200'
  },
  {
    id: 'Systems',
    name: 'Systems',
    subtitle: 'Architecture & Design',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0SRo1b9LRhfom-h2x-WlGg1cJhVICGOFaqlefSWoQa3Jk9ywdO4q_1_BpHL5VslwJ6GdT_sADdg02-G6Uvv_49ozYcd-5yqvEZMRrl--kiE741eFY9xvw6TWlA6hdO1-cLpkc4O54N4Uz3VTWcqt2BILpvkZcnX8y2aQN3mzZsVtV7b60PtoAvuoPPmkj-7HjaBb1B_aAcKACRhJM7o_leSCgOhE2arLexX3gPw6SRbtjgjoCzXqwdrHtUjz1HrOw-aaRzZ61sH4=w1200'
  },
  {
    id: 'Hardware',
    name: 'Hardware',
    subtitle: 'Electronics & Chips',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjOjODw9qOIunrtd9CV4Eoj3K4P8FI7js_a5JJJ1fq1hLb0Rr9JFTvJyA61rh6-1CHZPBd2boUW7E2q7iktTLvrEWyrVNioDhjlIJswgK8z44BNJK7quDanvOjo5n9I66I3t8bdbpyy-yKQWvaDkNuF9bhMhb5yqToll07Sn96gqo9KdBdDH4llDmDf4VNdb_saYC5WxXmBmpSUtMOjV_dekl-YpvXjyeqllRS2UcTBp6XiZtgC2Fb8Cw3oKYHsu8Jgx08ySLXDiU=w1200'
  },
  {
    id: 'Business',
    name: 'Business',
    subtitle: 'Startups & Ventures',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmVaBpmZMDn2Bd5MbHCQsXOD5Ey-vmW1ZzBEE4EcDW-ayoX9XAgORhW4c2Ygci8Os7O_d_AW3nvnfLOgcbMvm4yigNNf1hsf8jPJGi9klbWbbl8OIKJ4zi1zenmwqjWdXFhmCiWm-WRW_uYPZMzzQm5svh1xlDx8KxEqfZ7nKE-LHYduEDMtEfrmthgfyO86XazkyXzYAqX0O6VXQ1ZP_0qWZdH1l9tSSsodBuj-8Lj9QNoydO81sr1hJS8NqXSMHTZH7MVgAHg6k=w1200'
  },
  {
    id: 'Science',
    name: 'Science',
    subtitle: 'Research & Discovery',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0eFq3YJDYGYQrhGdyzIEZ8eVe3pEZzF2p1Ddc1DuC8ZdqRrCdbNqu57TZxqyM711awQ7XT9cz2hvky9uWTyxvl9NyiwFi9pQqeGU3Pvktr71-Bm3eqAsff2Q4oZfnnuhwpUP46T35GkVSn1j2ZSGF_eQLg1NqPFLxmKzFiszxRkC9SK_JBiqWbq7sZjB3pldExMjrlPmcAx8LVafftECxw4GGwuK4Om1dXEuLFZCL6PHs6Bnluo-5Z5o-_yRGsgwKagzHac7acyk=w1200'
  },
  {
    id: 'Technology',
    name: 'Technology',
    subtitle: 'General Tech',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEoj2PbgqauCg8Bn47ewC5i0UY5EYjA4ONPLtj-2pouB1icwI5UjX5IaRQaxSbPj-DLEMdElkW3tPr3Xsy7fH3IHNBTrAOcBKbKz78tHJG-5zi1zEZZgee0ANf-b3VV9kVzgUv0cIy5yoyLIDZaez8ZSD5wF1Pjr5a01bTYxFQMug73YKDZ1lm7fp9nXqLw1-O01EuR14cwSs8NjTB8FADinSS2tR7iwkIzHwANClRLAzThNksXHeD0CBCnpkClSnKvnM6mKEC3Fc=w1200'
  },
  {
    id: 'Tech Culture',
    name: 'Tech Culture',
    subtitle: 'Commentary & Opinion',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkvzZ1GxpzXSX2lfoZhhcVQDmNpi4m8JJjUDDQtYSE91hLK-x7sRS1f_Yg8Z0hFTmP1QOvLRkxk_foTRr5bOAVzd6Ve86sptz8oz_uuY-jJEtShe864h9SXqP5lL6PqWHEaAzYzxoCb7xnUXm3dGsH9HKDpBx34erj58UswU2DWw_MQwxm5SKJh0L0GtAdyJGiBQS3KbZ7BvbFlEXRhWx-CQABRSMwHiQKO9nZbTNvZAD6UY34ylsMzU1Hd9OnsJiwfZGRLFnVkz4=w1200'
  },
  {
    id: 'Digital History',
    name: 'Digital History',
    subtitle: 'Retro Computing',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmVaBpmZMDn2Bd5MbHCQsXOD5Ey-vmW1ZzBEE4EcDW-ayoX9XAgORhW4c2Ygci8Os7O_d_AW3nvnfLOgcbMvm4yigNNf1hsf8jPJGi9klbWbbl8OIKJ4zi1zenmwqjWdXFhmCiWm-WRW_uYPZMzzQm5svh1xlDx8KxEqfZ7nKE-LHYduEDMtEfrmthgfyO86XazkyXzYAqX0O6VXQ1ZP_0qWZdH1l9tSSsodBuj-8Lj9QNoydO81sr1hJS8NqXSMHTZH7MVgAHg6k=w1200'
  },
  {
    id: 'Windows Dev',
    name: 'Windows Dev',
    subtitle: 'Microsoft & Windows',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0SRo1b9LRhfom-h2x-WlGg1cJhVICGOFaqlefSWoQa3Jk9ywdO4q_1_BpHL5VslwJ6GdT_sADdg02-G6Uvv_49ozYcd-5yqvEZMRrl--kiE741eFY9xvw6TWlA6hdO1-cLpkc4O54N4Uz3VTWcqt2BILpvkZcnX8y2aQN3mzZsVtV7b60PtoAvuoPPmkj-7HjaBb1B_aAcKACRhJM7o_leSCgOhE2arLexX3gPw6SRbtjgjoCzXqwdrHtUjz1HrOw-aaRzZ61sH4=w1200'
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