'use strict';

const im = require('@fatchan/gm').subClass({ imageMagick: true })
    , config = require(__dirname+'/../../misc/config.js');

/**
 * cleans all metadata from image files
 * @param {String} filePath - path to the image
 * @param {String} mimetype - the file's mime type
 * @returns {Promise} - resolves upon metadata being removed, rejects if cleaning fails & rejectFailedExifClean is true
 */
module.exports = (filePath, mimetype) => {
    //check if exif cleaning is enabled (defaults to true)
    const cleanExif = config.get.cleanExif !== false;
    //check if we should reject failed exif cleaning (defaults to false)
    const rejectFailedExifClean = config.get.rejectFailedExifClean === true;
    
    //only processes image files if EXIF cleaning is enabled
    const mainType = mimetype.split('/')[0];
    if (!cleanExif || mainType !== 'image') {
        return Promise.resolve(); //skip cleaning if disabled (or not an image
    }

    return new Promise((resolve, reject) => {
        im(filePath)
            .strip() //removes all profiles and metadata
            .write(filePath, (err) => {
                if (err) {
                    console.error(`Error cleaning EXIF metadata: ${err.message}`);
                    //if rejectFailedExifClean = true, reject the promise & fail the upload
                    if (rejectFailedExifClean) {
                        return reject(new Error('Failed to clean image metadata'));
                    }
                    //else, just log the error and continue
                }
                resolve();
            });
    });
}; 