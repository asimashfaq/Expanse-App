import { isAuthenticated } from '../../helper/authentication'
const Premission = {
    createPayment: isAuthenticated
}
export default Premission
