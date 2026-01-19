import React, { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  fallbackSrc?: string;
  onError?: () => void;
}

const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  fallbackSrc = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWBtb4b8GJXGRkAyAKYSLg8padcTFx41kIuvb-4qCogDGVgwB410EiiAKF0HdJ7i0WBIVPDH0LtU67htw6iOA3zKuFj71VKmyCe7BBnYbgPCaPGk4pBUTWnEdXZxMJxAH70r9wiwkNg5feUENRlhBLrtsR-A-Gb1LVX2r_Y5zRtJFWBmj5vfSe846kcvuhtUZwKhXiCOff3SmcjbVg3HFA5AD3gU0CJdqWlhdzvssvkBOXqizvmHSRt5g9vuEyf2sqMuzhz3HXdOg=w1200',
  onError
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && imgSrc !== fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
      onError?.();
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={handleError}
    />
  );
};

export default SafeImage;
