import DBETToVETDepositContract from './Contracts/DBETToVETDepositContract'
import DBETV1TokenContract from './Contracts/DBETV1TokenContract'
import DBETV2TokenContract from './Contracts/DBETV2TokenContract'
import DBETVETTokenContract from './Contracts/DBETVETTokenContract'
import Web3 from 'web3';
export default class ContractHelper {
    protected web3: Web3;
    private v1TokenContract: DBETV1TokenContract;
    private v2TokenContract: DBETV2TokenContract;
    private depositContract: DBETToVETDepositContract;
    private vetContract: DBETVETTokenContract;
    /**
     *
     * @param {Web3} web3Param
     */
    constructor(web3Param: Web3, thor: Web3) {
        this.web3 = web3Param

        // Initialize new Contracts
        this.v1TokenContract = new DBETV1TokenContract(this.web3)
        this.v2TokenContract = new DBETV2TokenContract(this.web3)
        this.depositContract = new DBETToVETDepositContract(this.web3, thor)
        this.vetContract = new DBETVETTokenContract(this.web3, thor)

    }

    get V1Token() {
        return this.v1TokenContract
    }

    get V2Token() {
        return this.v2TokenContract
    }

    get DepositToVET() {
        return this.depositContract
    }

    get VETToken() {
        return this.vetContract
    }
}
