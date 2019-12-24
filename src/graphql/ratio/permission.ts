import { isAuthenticated } from '../../helper/authentication'
const Premission = {
    createRatio: isAuthenticated
}
export default Premission
