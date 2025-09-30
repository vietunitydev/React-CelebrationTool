import { get, post, del, createAuthHeaders } from '../utils/api.js'

class PaymentService {
    async createPayment(plan) {
        try{
            console.log(plan);
            const response = await post('/payments/create',{plan: plan});
            console.log(response);
            return response;
        }
        catch(error){
            console.error('Error fetching projects:', error);
            throw new Error(`Failed to fetch projects: ${error.message}`);
        }
    }

    async clientVNPayReturn(queryString) {
        try{
            console.log(queryString);

            const response = await get('/payments/vnpay_return?$'+queryString);
            console.log(response);
            return response;
        }
        catch(error){
            console.error('Error fetching projects:', error);
            throw new Error(`Failed to fetch projects: ${error.message}`);
        }
    }

    async checkStatusOder(orderId) {
        try{
            const response = await get('/payments/check-key/'+orderId);
            console.log(response);
            return response;
        }
        catch(error){
            console.error('Error fetching projects:', error);
            throw new Error(`Failed to fetch projects: ${error.message}`);
        }
    }
}

const paymentService = new PaymentService();
export default paymentService;