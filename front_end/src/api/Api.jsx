import axios from 'axios'
import SellAsset from '../components/SellAsset';



const API_BASE_URL = import.meta.env.VITE_API_BASE_URL


const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
})


// Auth token management
class TokenManager {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
        this.setupInterceptors();

        console.log('TokenManager initialized:', {
            hasToken: !!this.token,
            tokenPreview: this.token ? this.token.substring(0, 20) + '...' : null,
            user: this.user
        });
    }

    setupInterceptors() {
        api.interceptors.request.use(
            (config) => {
                console.log('Making request to:', config.url);
                console.log('Current token exists:', !!this.token);
                if (this.token) {
                    config.headers.Authorization = `Bearer ${this.token}`;
                    console.log('Added Authorization header:', config.headers.Authorization.substring(0, 30) + '...');
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const handleTokenExpiration = (error) => {
            if (error.response?.status === 401) {
                this.clearToken();
                window.location.href = '/startpage';
            }
            return Promise.reject(error);
        };

        api.interceptors.response.use(
            (response) => {
                
                return response;
            },
            (error) => {
                console.error('Response error:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    url: error.config?.url
                });
                
                if (error.response?.status === 401) {
                    
                    this.clearToken();
                    window.location.href = '/startpage';
                }
                return Promise.reject(error);
            }
        );

    }

    setToken(token, user) {
        this.token = token;
        this.user = user;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    }

    clearToken() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');const response = await api.post('/api/signup', userData);
        localStorage.removeItem('user');
    }

    isAuthenticated() {
        return !!this.token;
    }

    getUser() {
        return this.user;
    }
}

const tokenManager = new TokenManager();

// Authentication functions
export const auth = {
    async signup(userData) {
        try {
            const response = await api.post('/api/signup', userData);
            tokenManager.setToken(response.data.access_token, response.data.user);
            return { success: true, data: response.data };
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Network error';
            return { success: false, error: errorMessage };
        }
    },

    async signin(credentials) {
        try {
            const response = await api.post('/api/signin', credentials);
            tokenManager.setToken(response.data.access_token, response.data.user);
            return { success: true, data: response.data };
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Network error';
            return { success: false, error: errorMessage };
        }
    },

    async getProfile() {
        try {
            const response = await api.get('/api/profile');
            return { success: true, data: response.data };
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Network error';
            return { success: false, error: errorMessage };
        }
    },

    logout() {
        tokenManager.clearToken();
    },

    isAuthenticated() {
        return tokenManager.isAuthenticated();
    },

    getUser() {
        return tokenManager.getUser();
    }
};


export const dataBase = {
    async fetchCommodity(commodity) {
        try {
            const response = await api.get(`/api/data/${commodity}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching commodity data:", error);
            throw error;
        }
    },

    // Add more data fetching functions as needed
    async fetchUserData() {
        try {
            const response = await api.get('/api/user/data');
            return response.data;
        } catch (error) {
            console.error("Error fetching user data:", error);
            throw error;
        }
    },

    async fetchDashboard() {
        try {
            const response = await api.get('/api/dashboard');
            return response.data;
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            throw error;
        }
    },

    async fetchOpportunities() {
        try {
            return await api.get('/api/opportunities');
            
        } catch (error) {
            console.error("Error fetching opportunities", error)
            throw error
        }
    },

    async fetchNews() {
        try {
            return await api.get('/api/agriculture-news')
        } catch (error) {
            console.error("Error fetching news", error)
            throw error
        }
    },

    async addInvestment(investment) {
        try {
            await api.post('/api/investment/add', investment);
        } catch (error) {
            console.error("Error adding investment:", error);
            throw error;
        }
    },

    async updateInvestment(updatedInvestment) {
        try {
            await api.put('/api/investment/update', updatedInvestment )
        } 
        catch (error) {
            console.error("Error updating investment:", error);
            throw error;
        }

    },

    
    async withdrawInvestment(withdrawal) {
        try {
            await api.post('/api/investment/withdraw', withdrawal);
        } catch (error) {
            console.error("Error withdrawing investment:", error);
            throw error;
        }
    },

    async transferInvestment(payload) {
        try {
            await api.post('/api/investment/transfer', payload);
        } catch (error) {
            console.error("Error transferring investment:", error);
            throw error;
        }
    },

    async exitInvestment(payload) {
        try {
            await api.post('/api/investment/exit', payload);
        } catch (error) {
            console.error("Error exiting investment:", error);
            throw error;
        }
    }

    
};

export const transactions = {

    async create_payment(paymentData) {
        try {
            return await api.post('/api/payment', paymentData)

        }  catch (error) {
            console.error("Error making payment:", error);
            throw error;
        }
    }
    
    
}

// Legacy support for your existing code
export const fetchData = dataBase.fetchCommodity;
