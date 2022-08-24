const kB_IN_MB = 1024;
const MAX_FILE_SIZE_IN_MB = 5;
const MAX_FILE_SIZE = kB_IN_MB * MAX_FILE_SIZE_IN_MB;
import { failMessage } from '@/utils/notification-messages'

export default {
  data() {
    return {
      limit: 1,
      allowVideos: false,
      base64FileData: '',
      fileName: '',
      fileType: ''
    };
  },
  computed: {
    hasAttachment: function() {
      return this.base64FileData !== ''
    }
  },
  methods: {
    isFileSizeTooLarge(file) {
      return ( file.size / kB_IN_MB ) >= MAX_FILE_SIZE
    },
    handleExceed(files, fileList) {
      this.$message(failMessage(`The limit is ${this.limit}, you selected ${files.length} files this time, add up to ${files.length + fileList.length} totally`))
    },
    onUploadChange(file)
    {
      if (!file) {
        this.base64FileData = ''
        this.fileName = ''
        this.fileType = ''
      } else {
        const isImage = (file.raw.type === 'image/jpeg' || file.raw.type === 'image/png'|| file.raw.type === 'image/gif');
        const isVideo = (file.raw.type === 'video/mp4');
        const isFileSizeTooLarge = this.isFileSizeTooLarge(file);
        if (!isImage && !this.allowVideos) {
          this.$message(failMessage('Upload file must be an image!'));
          this.$refs.fileUploader.clearFiles()
          return false;
        }
        if (!isImage && !isVideo && this.allowVideos) {
          this.$message(failMessage('Upload file must be an image or video!'));
          this.$refs.fileUploader.clearFiles()
          return false;
        }
        if (isFileSizeTooLarge) {
          this.$message(failMessage(`Upload file size cannot exceed ${MAX_FILE_SIZE_IN_MB} MB!`));
          this.$refs.fileUploader.clearFiles()
          return false;
        }
        this.fileName = file.name
        this.fileType = file.raw.type
        var reader = new FileReader();
        reader.readAsDataURL(file.raw);
        reader.onload = (e) => this.loadFile(e)
      }
    },
    loadFile(e) {
      this.base64FileData = e.target.result
    },
    beforeRemove(file) {
      const isFileSizeTooLarge = this.isFileSizeTooLarge(file)
      if (isFileSizeTooLarge) {
        return true
      }
      return this.$confirm(`Remove ${ file.name } ?`);
    },
    beforeUpload(file)
    {
      const isFileSizeTooLarge = this.isFileSizeTooLarge(file);
      if (isFileSizeTooLarge) {
        this.$message(failMessage(`Upload file size cannot exceed ${MAX_FILE_SIZE_IN_MB} MB!`));
      }
      return !isFileSizeTooLarge;
    }
  }
}