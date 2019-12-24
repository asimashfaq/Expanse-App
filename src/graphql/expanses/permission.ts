import { isAuthenticated } from '../../helper/authentication'
const Premission = {
    createExpanses: isAuthenticated
}
export default Premission
