import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

import { FilePondFile } from 'filepond'
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImageCrop from 'filepond-plugin-image-crop'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageResize from 'filepond-plugin-image-resize'
import FilePondPluginImageTransform from 'filepond-plugin-image-transform'
import React from 'react'

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

const ImageUpload = ({ defaultImage, onProcessFile }: ImageUploadProps) => {
  return (
    <div className="w-full max-w-[9rem]">
      <FilePond
        files={defaultImage ? [defaultImage] : []}
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
        styleLoadIndicatorPosition="center bottom"
        styleProgressIndicatorPosition="right bottom"
        styleButtonRemoveItemPosition="left bottom"
        styleButtonProcessItemPosition="right bottom"
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

export default ImageUpload