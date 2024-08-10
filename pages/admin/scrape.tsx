import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthContextAdmin } from '../../contexts/AuthContextAdmin';
import withAuthAdmin from '../../hoc/withAuthAdmin';

type ImageInfo = {
  src: string;
  width: number | null;
  height: number | null;
  sizeInBytes: number | null;
  type: 'img' | 'source';
};

const ScrapePage: React.FC = () => {
  const { admin } = useAuthContextAdmin();
  const router = useRouter();

  const [url, setUrl] = useState('');
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    setError(null);
    try {
      const response = await fetch(`/api/scrape?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        const sortedImages = data.images.sort((a: ImageInfo, b: ImageInfo) => {
          return (b.sizeInBytes || 0) - (a.sizeInBytes || 0);
        });
        setImages(sortedImages);
      }
    } catch (err) {
      setError('An error occurred while fetching the images.');
    }
  };

  return (
    <div>
      <h1>Image Scraper</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL"
        className="input-field"
      />
      <button onClick={fetchImages} className="search-button">
        Fetch Images
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table className="image-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>WxH</th>
            <th>MB</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          {images.map((image, index) => (
            <tr key={index}>
              <td>
                <img src={image.src} alt={`image-${index}`} className="image" />
              </td>
              <td>
                {image.width && image.height ? `${image.width}x${image.height}` : 'N/A'}
              </td>
              <td>
                {image.sizeInBytes ? (image.sizeInBytes / (1024 * 1024)).toFixed(2) + ' MB' : 'N/A'}
              </td>
              <td>
                <div className="image-type">{image.type === 'img' ? 'img' : 'source'}</div>
                <a
                  href={image.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="image-link"
                >
                  {image.src}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .input-field,
        .search-button {
          font-size: 16px;
        }

        .image-table {
          width: 100%;
          table-layout: fixed;
          border-collapse: collapse;
          border: 1px solid black;
          font-size: 14px;
        }

        .image-table th,
        .image-table td {
          text-align: center;
          border: 1px solid black;
        }

        .image-table th {
          width: 150px;
        }

        .image-table th:last-child,
        .image-table td:last-child {
          width: auto;
        }

        .image {
          width: 150px;
          height: 100px;
          object-fit: cover;
        }

        .image-link {
          display: block;
          width: 90%;
          margin: 0 auto;
          overflow: hidden;
          white-space: nowrap;
        }

        .image-type {
          font-size: 12px;
          color: gray;
        }

        @media (max-width: 1000px) {
          .image-table {
            font-size: 12px;
          }

          .image-table th,
          .image-table td {
            width: 80px;
          }

          .image {
            width: 80px;
            height: 80px;
          }

          .image-table th:last-child,
          .image-table td:last-child {
            width: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default withAuthAdmin(ScrapePage);
