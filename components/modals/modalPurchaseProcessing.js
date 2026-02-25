import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import UtilService from '../../sip/utilService';
import LayoutModal from '../layouts/layoutModal';
import { TinyLoading } from '../loading';
import { FacebookShareButton, FacebookIcon, TwitterIcon, WhatsappIcon, TwitterShareButton, WhatsappShareButton, EmailIcon, EmailShareButton, LinkedinIcon, LinkedinShareButton, TelegramIcon, TelegramShareButton } from 'react-share';

const Border = styled.div`
  border: 1px solid grey;
  border-radius: 8px;
  width: 55px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
`

const ModalPurchaseProcessing = (props) => {

  // status = 1 hidden
  // status = 2 progressing
  // status = 3 purchased

  const { isVideo, image, rate, onClose, status, onList, name } = props;
  const router = useRouter();
  const { net, token_address, token_id } = router.query;
  const ipfsImage = UtilService.ConvertImg(image);
  const shareLink = `https://klik.cool/nftmarketplace/${net}/${token_address}/${token_id}`;

  return (
    <LayoutModal
      isOpen={status !== 0}
      title={status === 1 ? 'Your purchase is processing...' : 'You successfully purchased!'}
      onClose={onClose}
      // hiddenClose
    >
      <div className="d-center">
        {status === 1 && <TinyLoading />}

        {status !== 1 && (isVideo ? <video style={{ width: rate < 1 ? '40%' : 250 }} controls >
          <source src={ipfsImage} type="video/mp4" />
          Your browser does not support playing this Video
        </video> : <img src={ipfsImage} alt="" style={{ height: 'auto', maxWidth: '40%', borderRadius: 12 }} />)}

        <br />

        {status === 1 && <p className="color-b">
          Your purchase of <span className="color-sky"> {name} </span> is processing. It should be confirmed on the blockchain shortly.
        </p>}

        {status === 2 && <p className="color-b fs-14">
          Your are now the proud owner of Klik from the Klik collection.
        </p>}

        {
          status === 2 && <div>
            <div className="text-center">Let's show-off a little</div>
            <div className="mt-2 fs-12 d-flex flex-row">

              <div className="m-1 d-flex flex-column">
                <Border>
                  <WhatsappShareButton url={shareLink}>
                    <WhatsappIcon size={25} round />
                  </WhatsappShareButton>
                </Border>
                <div className="text-center">Whatsapp</div>
              </div>

              <div className="m-1 d-flex flex-column">
                <Border>
                  <TwitterShareButton url={shareLink}>
                    <TwitterIcon size={25} round />
                  </TwitterShareButton>
                </Border>
                <div className="text-center">Twitter</div>
              </div>

              <div className="m-1 d-flex flex-column">
                <Border>
                  <FacebookShareButton url={shareLink}>
                    <FacebookIcon size={25} round />
                  </FacebookShareButton>
                </Border>
                <div className="text-center">Facebook</div>
              </div>

              <div className="m-1 d-flex flex-column">
                <Border>
                  <TelegramShareButton url={shareLink}>
                    <TelegramIcon size={25} round />
                  </TelegramShareButton>
                </Border>
                <div className="text-center">Telegram</div>
              </div>

              <div className="m-1 d-flex flex-column">
                <Border>
                  <LinkedinShareButton url={shareLink}>
                    <LinkedinIcon size={25} round />
                  </LinkedinShareButton>
                </Border>
                <div className="text-center">Linkedin</div>
              </div>

              <div className="m-1 d-flex flex-column">
                <Border>
                  <EmailShareButton url={shareLink}>
                    <EmailIcon size={25} round />
                  </EmailShareButton>
                </Border>
                <div className="text-center">Email</div>
              </div>

            </div>
          </div>
        }

        {/* <div className="color-b text-center mt-4">
          <div className="f-14 fw-semibold">TRANSACTION ID</div>
          <div className="f-14 color-yellow">{UtilService.truncate(id)}</div>
        </div> */}

        {status === 2 && <div className="mt-4 d-flex flex-row">
          <div className="btn m-2 btn br-4" onClick={onList}>Close</div>
          {/* <div className="btn-main m-2 d-center" onClick={onView}>View item</div> */}
        </div>}
      </div>
    </LayoutModal>
  );
};

export default ModalPurchaseProcessing;