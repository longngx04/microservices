<template>
  <div class="url-shortener-container">
    <h2 class="title">Shorten Your URL</h2>
    <form @submit.prevent="shortenUrl" class="url-form">
      <input
        type="text"
        v-model="originalUrl"
        placeholder="Enter your URL"
        class="url-input"
        required
      />
      <button type="submit" class="shorten-button">Shorten</button>
    </form>
    <div v-if="shortUrl" class="result">
      <p class="result-text">
        Your shortened URL is: <a :href="shortUrl" target="_blank" class="short-url">{{ shortUrl }}</a>
      </p>
    </div>
    <div v-if="error" class="error">
      <p class="error-text">{{ error }}</p>
    </div>
    <div class="url-table-container" v-if="urlMappings.length > 0">
      <h3>URL Mapping Table</h3>
      <table class="url-table">
        <thead>
          <tr>
            <th>Original URL</th>
            <th>Shortened URL</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="mapping in urlMappings" :key="mapping.urlCode">
            <td>{{ mapping.originalUrl }}</td>
            <td><a :href="mapping.shortUrl" target="_blank" class="short-url">{{ mapping.shortUrl }}</a></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      originalUrl: '',
      shortUrl: '',
      urlMappings: [],
      error: ''  // Store error message here
    };
  },
  methods: {
    async shortenUrl() {
      try {
        const response = await axios.post('http://localhost:5001/shorten', {
          originalUrl: this.originalUrl
        });
        if (response.data.shortUrl) {
          this.shortUrl = response.data.shortUrl;
          this.urlMappings.push({
            originalUrl: this.originalUrl,
            shortUrl: this.shortUrl,
            urlCode: response.data.urlCode
          });
          this.error = ''; // Clear any previous error
        } else {
          this.error = 'An error occurred. Please try again.';
        }
      } catch (error) {
        if (error.response && error.response.data) {
          this.error = error.response.data; // Display server error message
        } else {
          this.error = 'An error occurred. Please try again.';
        }
      }
    }
  }
};
</script>

<style>
.url-shortener-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
}

.title {
  text-align: center;
  color: #333;
}

.url-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.url-input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.shorten-button {
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.shorten-button:hover {
  background-color: #0056b3;
}

.result {
  margin-top: 20px;
  text-align: center;
}

.result-text {
  color: #333;
}

.short-url {
  color: #007bff;
  text-decoration: none;
}

.short-url:hover {
  text-decoration: underline;
}

.url-table-container {
  margin-top: 30px;
}

.url-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.url-table th, .url-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

.url-table th {
  background-color: #f2f2f2;
}

.url-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.url-table tr:hover {
  background-color: #f1f1f1;
}

.error {
  margin-top: 20px;
  color: red;
  text-align: center;
}

.error-text {
  font-size: 16px;
}
</style>
