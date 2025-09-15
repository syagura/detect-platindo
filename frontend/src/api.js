// import axios from 'axios';

// const api = axios.create({
//     baseURL: "http://localhost:8000"
// });

// export default api;

import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        'Content-Type': 'multipart/form-data',  // Tambahin ini
    }
});

export default api;