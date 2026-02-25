import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import hljs from 'highlight.js';
import { IcChatGPT, IcMe } from '../../../common/icons';

const PromptResponseList = ({ responseList }) => {
  const responseListRef = useRef(null);

  useEffect(() => {
    hljs.highlightAll();
  })

  useEffect(() => {
    hljs.highlightAll();
  }, [responseList]);

  return (
    <div className="prompt-response-list" ref={responseListRef}>
      {responseList && responseList.map((responseData) => (
        <div className={'response-container ' + (responseData.selfFlag ? 'my-question' : 'chatgpt-response')} key={responseData.id}>
          <img className="avatar-image" src={responseData.selfFlag ? IcMe.src : IcChatGPT.src} alt="avatar"/>
          <div className={(responseData.error ? 'error-response ' : '') + 'prompt-content'} id={responseData.id}>
            { responseData.image &&
                <img src={responseData.image} className="ai-image" alt="generated ai"/>
            }
            { responseData.response &&
              <ReactMarkdown
                components={{
                  code({ className, children }) {
                    return(
                      <code className={className}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {responseData.response}
              </ReactMarkdown>
            }
          </div>
        </div>
      ))}
    </div>
  );
};

export default PromptResponseList;
