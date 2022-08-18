export default {
  data() {
    return {
      fileList: [],
      limit: 1
    };
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`The limit is ${this.limit}, you selected ${files.length} files this time, add up to ${files.length + fileList.length} totally`);
    },
    beforeRemove(file) {
      return this.$confirm(`Cancel the transfer of ${ file.name } ?`);
    },
    beforeUpload(file)
    {
      //const isIMAGE = file.type === 'image/jpeg'||'image/gif'||'image/png';
      const isLessThan5MB = file.size / 1024 / 1024 < 5;

      /*if (!isIMAGE) {
        this.$message.error('Upload file can only be in picture format!');
      }*/
      if (!isLessThan5MB) {
        this.$message.error('Upload file size cannot exceed 5 MB!');
      }
      return /* isIMAGE && */ isLt1M;
    }
  }
}