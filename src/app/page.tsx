'use client';

import { useState } from 'react';
import { Message, continueConversation } from './actions';
import { readStreamableValue } from 'ai/rsc';
import Image from "next/image";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function Home() {
  const parseText = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*|\*)/g); // Divide el texto en partes donde encuentra ** o *

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      // Caso correcto de **texto**
      return <b key={index}>{part.slice(2, -2)}</b>; // Remueve los ** y aplica negrita
    } else if (part === '*') {
      // Caso de asterisco suelto
      return <br key={index} />;
    }
    return part;
  });
};
  const [conversation, setConversation] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  const onChangeSendMessage = (e: any) => {
    e?.preventDefault();
    if (e) {
      setInput(e.target.value);
    }
  };

  return (
    <>
      <div className="navbar bg-base-300">
        <div className="flex-1">
          <Image
            src={"./logo.svg"}
            width={150}
            height={80}
            alt='logo banco'
          ></Image>
        </div>
      </div>


      <div className='h-svh flex justify-center items-center flex-col'>
        <div className="card shadow-md w-full lg:w-96 md:w-96 bg-white">
          <div style={{
          display: "flex",
          justifyContent: "center",
          }}>
            <Image
            src={"./logo.svg"}
            width={150}
            height={80}
            className='pb-5'
            alt='logo banco'
            ></Image>
          </div>
          <div className="card-body">

            <div className='h-[500px] overflow-y-scroll'>
              {conversation.map((message, index) => (
                <div key={index}>
                  {
                    message.role === "assistant" ? (
                      <div className="chat chat-start">
                        <div className="chat-bubble bg-[#D9272E] text-white">{parseText(message.content)}</div>
                      </div>
                    ) : (
                      <div className="chat chat-end">
                          <div className="chat-bubble bg-[#77777A] text-white">{parseText(message.content)}</div>
                      </div>
                    )
                  }

                </div>
              ))}
            </div>

          </div>
          <div className='join'>
            <input
              type="text"
              className='input join-item'
              placeholder='Escribe un mensaje'
              value={input}
              onChange={(event) => onChangeSendMessage(event)}
            />
            <button
              className='btn bg-[#D9272E] text-white join-item'
              onClick={async () => {
                setInput('');
                const { messages, newMessage } = await continueConversation([
                  ...conversation,
                  { role: 'user', content: input },
                ]);

                let textContent = '';

                for await (const delta of readStreamableValue(newMessage)) {
                  textContent = `${textContent}${delta}`;

                  setConversation([
                    ...messages,
                    { role: 'assistant', content: textContent },
                  ]);
                }
              }}
            >
              Enviar Mensaje
            </button>
        </div>

        
        </div>
      </div>
      <footer className="footer footer-center bg-base-300 text-[#D9272E] p-10">
        <aside>
          <Image
            src={"./logo.svg"}
            width={150}
            height={80}
            alt='logo banco'
          ></Image>
          <p className="font-bold">
            Banco Atlántida
          </p>
        </aside>
        <nav>
          <div className="grid grid-flow-col gap-4 text-[#D9272E]">
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current">
                <path
                  d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current">
                <path
                  d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current">
                <path
                  d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
          </div>
        </nav>
      </footer>
    </>

  );
}