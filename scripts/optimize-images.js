#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
  inputDir: path.join(__dirname, '../public/brand-bible'),
  outputDir: path.join(__dirname, '../public/brand-bible-optimized'),
  formats: ['webp', 'avif', 'jpg'],
  sizes: [400, 600, 800, 1200, 1600], // Responsive sizes
  quality: {
    webp: 75,
    avif: 65,
    jpg: 80
  },
  progressive: true
};

/**
 * Generate optimized images in multiple formats and sizes
 */
async function optimizeImage(inputPath, outputDir, basename) {
  const stats = {
    originalSize: 0,
    optimizedSizes: {},
    compressionRatio: 0
  };

  try {
    // Get original file size
    const originalStats = await fs.stat(inputPath);
    stats.originalSize = originalStats.size;

    console.log(`📸 Processing: ${basename}`);
    console.log(`   Original size: ${(stats.originalSize / 1024).toFixed(2)} KB`);

    // Create base sharp instance
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Generate images for each size and format
    for (const size of config.sizes) {
      // Skip if original is smaller than target size
      if (metadata.width && metadata.width < size) continue;

      for (const format of config.formats) {
        const outputFilename = `${basename}-${size}w.${format}`;
        const outputPath = path.join(outputDir, outputFilename);

        let processedImage = image
          .resize(size, null, {
            withoutEnlargement: true,
            fit: 'inside'
          });

        // Apply format-specific optimization
        switch (format) {
          case 'webp':
            processedImage = processedImage.webp({
              quality: config.quality.webp,
              effort: 6, // Maximum compression effort
              progressive: config.progressive
            });
            break;
          case 'avif':
            processedImage = processedImage.avif({
              quality: config.quality.avif,
              effort: 9, // Maximum compression effort
              progressive: config.progressive
            });
            break;
          case 'jpg':
            processedImage = processedImage.jpeg({
              quality: config.quality.jpg,
              progressive: config.progressive,
              mozjpeg: true // Use mozjpeg encoder for better compression
            });
            break;
        }

        await processedImage.toFile(outputPath);
        
        // Track file size
        const optimizedStats = await fs.stat(outputPath);
        const sizeKey = `${format}_${size}w`;
        stats.optimizedSizes[sizeKey] = optimizedStats.size;

        console.log(`   ✅ ${outputFilename}: ${(optimizedStats.size / 1024).toFixed(2)} KB`);
      }
    }

    // Calculate overall compression ratio
    const totalOptimizedSize = Object.values(stats.optimizedSizes).reduce((sum, size) => sum + size, 0);
    stats.compressionRatio = ((stats.originalSize - totalOptimizedSize) / stats.originalSize * 100);

    console.log(`   💾 Total compression: ${stats.compressionRatio.toFixed(1)}%\n`);

    return stats;
  } catch (error) {
    console.error(`❌ Error processing ${basename}:`, error.message);
    return null;
  }
}

/**
 * Generate low-quality blur placeholders
 */
async function generateBlurPlaceholder(inputPath, outputDir, basename) {
  try {
    const blurPath = path.join(outputDir, `${basename}-blur.jpg`);
    
    await sharp(inputPath)
      .resize(20, 20, { fit: 'inside' })
      .jpeg({ quality: 20 })
      .toFile(blurPath);

    // Convert to base64 data URL
    const buffer = await fs.readFile(blurPath);
    const base64 = buffer.toString('base64');
    const dataURL = `data:image/jpeg;base64,${base64}`;

    // Save data URL to JSON file for easy import
    const jsonPath = path.join(outputDir, `${basename}-blur.json`);
    await fs.writeJson(jsonPath, { dataURL, size: buffer.length });

    console.log(`   🔳 Blur placeholder: ${basename}-blur.jpg (${buffer.length} bytes)`);
    
    // Clean up temporary file
    await fs.remove(blurPath);
    
    return dataURL;
  } catch (error) {
    console.error(`❌ Error generating blur placeholder for ${basename}:`, error.message);
    return null;
  }
}

/**
 * Main optimization function
 */
async function optimizeAllImages() {
  console.log('🚀 Starting image optimization pipeline...\n');

  try {
    // Ensure output directory exists
    await fs.ensureDir(config.outputDir);

    // Get all image files
    const files = await fs.readdir(config.inputDir);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|webp)$/i.test(file)
    );

    if (imageFiles.length === 0) {
      console.log('❌ No image files found in input directory');
      return;
    }

    console.log(`📁 Found ${imageFiles.length} images to optimize\n`);

    const optimizationStats = {
      totalOriginalSize: 0,
      totalOptimizedSize: 0,
      processedImages: 0,
      blurPlaceholders: []
    };

    // Process each image
    for (const file of imageFiles) {
      const inputPath = path.join(config.inputDir, file);
      const basename = path.parse(file).name;

      // Optimize image
      const stats = await optimizeImage(inputPath, config.outputDir, basename);
      if (stats) {
        optimizationStats.totalOriginalSize += stats.originalSize;
        optimizationStats.totalOptimizedSize += Object.values(stats.optimizedSizes).reduce((sum, size) => sum + size, 0);
        optimizationStats.processedImages++;
      }

      // Generate blur placeholder
      const blurDataURL = await generateBlurPlaceholder(inputPath, config.outputDir, basename);
      if (blurDataURL) {
        optimizationStats.blurPlaceholders.push({
          name: basename,
          dataURL: blurDataURL
        });
      }
    }

    // Generate summary report
    const totalCompressionRatio = ((optimizationStats.totalOriginalSize - optimizationStats.totalOptimizedSize) / optimizationStats.totalOriginalSize * 100);

    console.log('📊 OPTIMIZATION SUMMARY');
    console.log('========================');
    console.log(`📸 Images processed: ${optimizationStats.processedImages}`);
    console.log(`📦 Original total size: ${(optimizationStats.totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`💾 Optimized total size: ${(optimizationStats.totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`🗜️  Total compression: ${totalCompressionRatio.toFixed(1)}%`);
    console.log(`🔳 Blur placeholders: ${optimizationStats.blurPlaceholders.length}`);

    // Save optimization manifest
    const manifest = {
      timestamp: new Date().toISOString(),
      config,
      stats: optimizationStats,
      blurPlaceholders: optimizationStats.blurPlaceholders
    };

    await fs.writeJson(path.join(config.outputDir, 'optimization-manifest.json'), manifest, { spaces: 2 });
    
    console.log('\n✅ Image optimization completed successfully!');
    console.log(`📄 Manifest saved to: ${path.join(config.outputDir, 'optimization-manifest.json')}`);

  } catch (error) {
    console.error('❌ Optimization failed:', error);
    process.exit(1);
  }
}

// Run optimization if script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  optimizeAllImages();
}

export { optimizeAllImages, config };