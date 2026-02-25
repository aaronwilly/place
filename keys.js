export const PROD = process.env.NEXT_PUBLIC_APP_ENV === 'prod' || process.env.NEXT_PUBLIC_APP_ENV === 'stage';
export const VERSION = 'v6.07';

export const MUMBAI_ERC20_ADDRESS = '0x1D0DaCc708Bd0F42a0f100F0F1b2D3a32A4f6aB7' // 12/14
export const MUMBAI_MINT721_ADDRESS = '0x0A605283B727BC877b8d1953E34B297503C93614' // 12/14
export const MUMBAI_MINT1155_ADDRESS = '0xbCe1783109ca4B58833329Cd9a59Bb330F1B3296' // 12/14
export const MUMBAI_MARKETPLACE_ADDRESS = '0x092486340407eF2a1aeBEb7d7C74A0a7F042e0Cd' // 12/14

export const RINKEYBY_MINT721_ADDRESS = '0xEe12F54351441Da466a5D5B7D0e04c304170206e' // 6/21
export const RINKEYBY_MINT1155_ADDRESS = '0xeaC85a9151dB3875041711d39c0561EdF88D2F30' // 6/21
export const RINKEYBY_MARKETPLACE_ADDRESS = '0xa579195E19fa8D11781Ef0e9A99e29E0386E03d6' // 6/21

export const BSCT_ERC20_ADDRESS = '0x547395645C7DbCab62e22b403aAB9392fAa28ADB' // 6/21
export const BSCT_MINT721_ADDRESS = '0x9A6EbbB24D662557FCd965618b27fDc8188331Cb' // 6/21
export const BSCT_MINT1155_ADDRESS = '0x8c9098822E0Ad0a258598bd26c6Fe6B8cDA1d8bE' // 6/21
export const BSCT_MARKETPLACE_ADDRESS = '0x8E84f74289419def3CE022060F68C1a51D45B3BC' // 6/21

export const ROPSTEN_ERC20_ADDRESS = '0x79Fc726f738fd4F856a79aD3e7b353Fa2749C9cf' // 9/12
export const ROPSTEN_MINT721_ADDRESS = '0x6B170f1Db0B3eC10DE49900cc9e56887752De1e1' // 9/12
export const ROPSTEN_MINT1155_ADDRESS = '0x1436dEA9C84f6582C93a59331a360Bc0EeDc660F' // 9/12
export const ROPSTEN_MARKETPLACE_ADDRESS = '0x8Ae235205d62644e279756C255592deAa4e224C1' // 9/12

export const GOERLI_ERC20_ADDRESS = '0x638583Eae7197a4D5cb2833B3c5556732eD09E49' // 9/23
export const GOERLI_MINT721_ADDRESS = '0x67e58Df9F17bdeF1245198D5565937fC42B5D217' // 9/23
export const GOERLI_MINT1155_ADDRESS = '0xeE3A7C32B0E104FFA8E6384D0dB1C9a21727Aa9B' // 9/23
export const GOERLI_MARKETPLACE_ADDRESS = '0xe5522e8157D9A787fDfc9065dEEC596F8A9d42D9' // 03/21/23

export const MAIN_ERC20_ADDRESS = '0xA56ac1B7972c38e277eF3bac5f94aA60B2Ec467e' // 10/25
export const MAIN_MINT721_ADDRESS = '0xf5c502A8c31A210EAB6b7837E7C56d65d3Af2F83' // 10/25
export const MAIN_MINT1155_ADDRESS = '0xa8abA6bB110745e079Ad90cbbAF62102c8bA80Fe' // 10/25
export const MAIN_MARKETPLACE_ADDRESS = '0xaA503BCFaA5388dAa6649161581332EdaA5e794f' // 10/25

export const POLYGON_ERC20_ADDRESS = '0x638583Eae7197a4D5cb2833B3c5556732eD09E49' // 01/20
export const POLYGON_MINT721_ADDRESS = '0x67e58Df9F17bdeF1245198D5565937fC42B5D217' // 01/20
export const POLYGON_MINT1155_ADDRESS = '0xeE3A7C32B0E104FFA8E6384D0dB1C9a21727Aa9B' // 01/20
export const POLYGON_MARKETPLACE_ADDRESS = '0x387BcB89a9365566e2d70e7fB59F51A929318273' // 01/20

export const VERIFY_PRICE = 2;

export const DEMO_DEFAULT_AVATAR = 'https://www.colorhexa.com/141414.png';
export const PROFILE_BG = 'https://cdn.pixabay.com/photo/2016/12/29/18/44/background-1939128_960_720.jpg';
export const DEMO_BACKGROUND = 'https://cdn.pixabay.com/photo/2016/12/29/18/44/background-1939128_960_720.jpg';

export const TITLE = 'KLIK, make NFTs for your commmunity';
export const DESCRIPTION = 'Build communities using NFTs, monetize your creative content, and grow hyper-loyal followers. Klik makes it easy to mint and sell NFTs, and make money.';
export const BACKEND_API = process.env.NEXT_PUBLIC_APP_BACKEND_VIDEO_UPLOAD_URL

const projectId = process.env.NEXT_PUBLIC_APP_INFURA_IPFS_ID // infura ipfs project id
const projectSecretKey = process.env.NEXT_PUBLIC_APP_INFURA_IPFS_SECURITY_KEY // infura ipfs project secret key

export const InfuraAuth = 'Basic ' + btoa(projectId + ':' + projectSecretKey);
export const InfuraLink = 'https://ipfs.infura.io:5001/api/v0';
export const ALCHEMY_KEY = process.env.NEXT_PUBLIC_APP_ALCHEMY_KEY
export const ALCHEMY_KEY_GOERLI = process.env.NEXT_PUBLIC_APP_ALCHEMY_KEY_GOERLI
export const ALCHEMY_KEY_MUMBAI = process.env.NEXT_PUBLIC_APP_ALCHEMY_KEY_MUMBAI
export const ALCHEMY_KEY_POLYGON = process.env.NEXT_PUBLIC_APP_ALCHEMY_KEY_POLYGON

export const WEB3AUTH_CLIENTID = process.env.NEXT_PUBLIC_APP_WEB3AUTH_CLIENTID

export const BackendUrl = process.env.NEXT_PUBLIC_APP_BACKEND_URL
export const StreamAccessKey = process.env.NEXT_PUBLIC_APP_STREAM_ACCESS_KEY
export const StripeKey = process.env.NEXT_PUBLIC_APP_STRIPE_KEY
export const NotificationBaseUrl = 'https://us-central1-metasaltnotifications.cloudfunctions.net/notification/';
export const SMSBaseUrl = 'https://us-central1-metasaltnotifications.cloudfunctions.net/sms/';
export const RoomsUrl = 'https://api.100ms.live/v2/rooms';
export const ActiveRoomsUrl = 'https://api.100ms.live/v2/active-rooms';
export const SessionUrl = 'https://api.100ms.live/v2/sessions';
export const InviteUrl = process.env.NEXT_PUBLIC_APP_ENV === 'prod' ? 'https://klik.cool/login' : (process.env.NEXT_PUBLIC_APP_ENV === 'stage' ? 'https://stage.saltapp.io/login' : 'https://dev.saltapp.io/login');
export const DEMO_AVATAR = 'https://ucarecdn.com/b693caa9-e73b-451e-ad00-2795f03aa25c/';

export const WERT_PARTNER_TEST = '01GSYZ0D48X99WJQR6K8AQH6MD'
export const WERT_PARTNER_PROD = '01GXEFRMPT253WPYFC9WV5Q70B'
export const WERT_ORIGIN_TEST = 'https://sandbox.wert.io'
export const WERT_ORIGIN_PROD = 'https://widget.wert.io'
export const WERT_COMMODITIES_TEST = 'ETH:Ethereum-Goerli'
export const WERT_COMMODITIES_PROD = '[{\"commodity\":\"ETH\",\"network\":\"ethereum\"}]'
export const WERT_PRIVATE_KEY_TEST = '0x57466afb5491ee372b3b30d82ef7e7a0583c9e36aef0f02435bd164fe172b1d3'
export const WERT_PRIVATE_KEY_PROD = '0xc44f3e7f0b06ee8479e183e8ce36349f050b84ae1301642244fe1490a97661dc'
