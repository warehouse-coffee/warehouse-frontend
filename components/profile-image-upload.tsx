import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

import { FilePondFile } from 'filepond'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImageCrop from 'filepond-plugin-image-crop'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageResize from 'filepond-plugin-image-resize'
import FilePondPluginImageTransform from 'filepond-plugin-image-transform'
import React from 'react'
import { FilePond, registerPlugin } from 'react-filepond'

registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginImageCrop,
  FilePondPluginImageResize,
  FilePondPluginImageTransform
)

interface ImageUploadProps {
  defaultImage?: File | string | null
  onProcessFile?: (file: File | null) => void
}

const ProfileImageUpload = ({ defaultImage, onProcessFile }: ImageUploadProps) => {
  const getFullImageUrl = (image: File | string | null) => {
    if (!image) return null
    if (image instanceof File) return image
    if (typeof image === 'string') return image
    return null
  }

  const processedImage = getFullImageUrl(defaultImage as File | string | null)

  return (
    <div className="w-full max-w-[9rem]">
      <FilePond
        files={processedImage ? [processedImage] : []}
        allowMultiple={false}
        maxFiles={1}
        name="avatarImage"
        credits={false}
        acceptedFileTypes={['image/*']}
        labelIdle='Drag & Drop <span class="filepond--label-action">or select file</span>'
        imagePreviewHeight={170}
        imageCropAspectRatio="1:1"
        imageResizeTargetWidth={200}
        imageResizeTargetHeight={200}
        stylePanelLayout="compact circle"
        styleLoadIndicatorPosition="right bottom"
        styleProgressIndicatorPosition="right bottom"
        styleButtonRemoveItemPosition="right bottom"
        styleButtonProcessItemPosition="right bottom"
        server={{
          process: async (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
            progress(true, 0, 100)
            load(file)
          }
        }}
        onupdatefiles={(fileItems: FilePondFile[]) => {
          const file = fileItems[0]?.file || null
          if (onProcessFile) {
            onProcessFile(file as File)
          }
        }}
      />
    </div>
  )
}

export default ProfileImageUpload