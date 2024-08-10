import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import * as cheerio from 'cheerio';
import sizeOf from 'image-size';
import { URL } from 'url';

type ImageInfo = {
  src: string;
  width: number | null;
  height: number | null;
  sizeInBytes: number | null;
  type: 'img' | 'source';  // 新しいフィールドを追加
};

type Data = {
  images: ImageInfo[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    res.status(400).json({ images: [], error: 'Invalid URL' });
    return;
  }

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const baseUrl = new URL(url);

    const images: ImageInfo[] = [];

    const fetchImageInfo = async (src: string, type: 'img' | 'source'): Promise<ImageInfo> => {
      try {
        const imageUrl = new URL(src, baseUrl.origin).toString();
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(imageResponse.data);
        const dimensions = sizeOf(buffer);

        return {
          src: imageUrl,
          width: dimensions.width || null,
          height: dimensions.height || null,
          sizeInBytes: buffer.length,
          type,  // タイプをセット
        };
      } catch (error) {
        console.error(`Failed to fetch image at ${src}:`, error);
        return {
          src,
          width: null,
          height: null,
          sizeInBytes: null,
          type,  // タイプをセット
        };
      }
    };

    const promises: Promise<void>[] = [];

    // imgタグから画像情報を取得
    $('img').each((_, element) => {
      let src = $(element).attr('src');
      if (src) {
        // 相対パスを絶対パスに変換
        src = new URL(src, baseUrl.origin).toString();
        promises.push(
          fetchImageInfo(src, 'img').then(imageInfo => {
            images.push(imageInfo);
          })
        );
      }
    });

    // sourceタグから画像情報を取得
    $('source').each((_, element) => {
      const srcset = $(element).attr('srcset');
      const src = $(element).attr('src');
      const urls = srcset ? srcset.split(',').map(s => s.trim().split(' ')[0]) : src ? [src] : [];

      urls.forEach(url => {
        const absoluteUrl = new URL(url, baseUrl.origin).toString();
        promises.push(
          fetchImageInfo(absoluteUrl, 'source').then(imageInfo => {
            images.push(imageInfo);
          })
        );
      });
    });

    await Promise.all(promises);

    res.status(200).json({ images });
  } catch (error) {
    res.status(500).json({ images: [], error: 'Failed to fetch or parse the page' });
  }
}
