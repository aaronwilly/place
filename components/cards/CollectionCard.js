import { useRouter } from 'next/router';
import React from 'react';
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  .col-card {
    width: 450px;
    height: 300px;
    margin: 10px 4px;
  }
  .nft_wrap {
    width: 428px;
    height: 180px;
    background-repeat: no-repeat, repeat;
    background-size: 100% 100%;
    background-position: center;
  }
  .nft_coll{
    &:hover {
      box-shadow: rgba(0, 0, 0, 0.19) 0 10px 20px, rgba(0, 0, 0, 0.23) 0 6px 6px; 
    }
  }
  
`;

const CollectionCard = ({ index, avatar, banner, username, description, collectionId }) => {
  let router = useRouter();

  return (
    <div key={index} className="col-card">
      <GlobalStyles />

      <div className="nft_coll" style={{ position: 'relative' }}>
        <div className="nft_wrap cursor-pointer" style={{ backgroundImage: `url(${banner})`, }} onClick={()=>router.push(`/subCollection/${collectionId}`, undefined, { shallow: true } )}>
        </div>
        <div className="nft_coll_pp">
          <span><img className="lazy" src={avatar} alt="" style={{ width: 60, height: 60, objectFit: 'cover' }}/></span>
          <i className="fa fa-check" />
        </div>
        <div className="nft_coll_info" style={{ margin: '0 20px' }}>
          <div><h4 className="color-b">{username}</h4></div>
          <div style={{ fontSize: 14, height: 60, overflow: 'hidden' }}>{description}</div>
        </div>
      </div>
    </div>
  )
}

export default CollectionCard;
