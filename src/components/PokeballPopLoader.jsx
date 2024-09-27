const PokeballPopLoader = () => {
   return (
      <div className="flex justify-center items-center min-h-screen">
         <svg
            viewBox="0 0 100 100"
            width="150"
            height="150"
            className="ball-animation" // Adding ball animation class
         >
            <g transform="translate(50 50) scale(0.8)">
               <g transform="translate(0 50)">
                  <g className="gravity">
                     <g transform="translate(0 -50)">
                        <g className="ball scale-100">
                           <g className="bottom">
                              <path
                                 fill="#ffffff"
                                 stroke="#303030"
                                 strokeWidth="5"
                                 d="M -47.5 0 a 47.5 47.5 0 0 0 95 0z"
                              ></path>
                           </g>
                           <g className="top">
                              <path
                                 fill="#f15d5f"
                                 d="M -47.5 0 a 47.5 47.5 0 0 1 95 0"
                              ></path>
                              <path
                                 fill="none"
                                 stroke="#ffffff"
                                 strokeWidth="5"
                                 strokeLinecap="round"
                                 strokeDasharray="0 15 9 9 20 100"
                                 d="M -38 -0 a 38 38 0 0 1 76 0"
                              ></path>
                              <path
                                 fill="none"
                                 stroke="#303030"
                                 strokeWidth="5"
                                 d="M -47.5 0 a 47.5 47.5 0 0 1 95 0z"
                              ></path>
                           </g>
                           <g className="open">
                              <path
                                 fill="#303030"
                                 stroke="#303030"
                                 strokeWidth="5"
                                 strokeLinejoin="round"
                                 d="M -47.5 -10 a 190 190 0 0 1 95 0 a 190 190 0 0 1 -95 0"
                              ></path>
                              <path
                                 fill="#303030"
                                 stroke="#303030"
                                 strokeWidth="5"
                                 strokeLinejoin="round"
                                 d="M -47.5 5 a 160 160 0 0 0 95 0 a 180 180 0 0 0 -95 0"
                              ></path>
                           </g>
                           <g className="center">
                              <circle
                                 fill="#ffffff"
                                 stroke="#303030"
                                 strokeWidth="5"
                                 cx="0"
                                 cy="0"
                                 r="12"
                              ></circle>
                              <circle
                                 fill="#ffffff"
                                 stroke="#303030"
                                 strokeWidth="3"
                                 cx="0"
                                 cy="0"
                                 r="6"
                              ></circle>
                              <g className="inner opacity-0">
                                 <circle
                                    fill="#f15d5f"
                                    cx="0"
                                    cy="0"
                                    r="4.5"
                                 ></circle>
                              </g>
                           </g>
                        </g>
                     </g>
                  </g>
               </g>
            </g>
         </svg>
         <style>
            {`
               @keyframes shake {
                  20%{transform: rotate(-10deg);}
                  60%{transform: rotate(10deg);}
                  80%{transform: rotate(0deg);}
               }

               @keyframes openClose {
                  0%{transform: scaleY(1);}
                  50%{transform: scaleY(0.95);}
                  100%{transform: scaleY(1);}
               }

               @keyframes translateUp {
                  to{transform: translateY(-10px);}
               }
               @keyframes translateDown {
                  to{transform: translateY(5px);}
               }
               @keyframes translateHigher {
                  to{transform: translateY(-18px);}
               }

               .ball-animation{
                  animation: openClose 0.5s ease-in-out infinite;
               }

               .shaking .gravity{
                  animation: shake 0.75s infinite cubic-bezier(0.645, 0.045, 0.335, 1);
               }

               .failure.open{
                  animation: scaleUp 0.2s 0.1s cubic-bezier(0.645, 0.045, 0.335, 1) forwards;
               }
               .failure.top{
                  animation: translateUp 0.3s cubic-bezier(0.645, 0.045, 0.335, 1) forwards;
               }
               .failure.bottom{
                  animation: translateDown 0.3s cubic-bezier(0.645, 0.045, 0.335, 1) forwards;
               }
               .failure.center{
                  animation: translateHigher 0.3s cubic-bezier(0.645, 0.045, 0.335, 1) forwards;
               }
            `}
         </style>
      </div>
   )
}

export default PokeballPopLoader;