const createFromData = {
    // Tạo FormData cho một file duy nhất
    single: (data) => {
        let formData = new FormData();
        let file = data[0].originFileObj;
        formData.append('file', file); // 'file' là key phía server nhận
        return formData;
    },

    // Tạo FormData cho nhiều file
    many: (data) => {
        let formData = new FormData();

        data.forEach(item => {
            let file = item.originFileObj;
            formData.append('files', file); // 'files' là key phía server nhận
        });

        return formData;
    }
}

export default createFromData;
