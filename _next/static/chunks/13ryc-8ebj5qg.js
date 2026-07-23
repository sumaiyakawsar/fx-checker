(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,33525,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"warnOnce",{enumerable:!0,get:function(){return s}});let s=e=>{}},11039,e=>{"use strict";var t=e.i(43476);e.i(71645);var r=e.i(63178);{let e=console.error;console.error=(...t)=>{"string"==typeof t[0]&&t[0].includes("Encountered a script tag")||e(...t)}}e.s(["ThemeProvider",0,function({children:e}){return(0,t.jsx)(r.ThemeProvider,{attribute:"class",defaultTheme:"dark",enableSystem:!1,children:e})}])},58652,e=>{"use strict";var t=e.i(43476),r=e.i(71645),s=e.i(9236);let n=(0,r.createContext)(null);e.s(["AuthProvider",0,function({children:e}){let[o,u]=(0,r.useState)(null),[i,a]=(0,r.useState)(!0),c=(0,s.createClient)();return(0,r.useEffect)(()=>{c.auth.getUser().then(({data:e})=>{u(e.user),a(!1)});let{data:e}=c.auth.onAuthStateChange((e,t)=>{u(t?.user??null)});return()=>e.subscription.unsubscribe()},[c]),(0,t.jsx)(n.Provider,{value:{user:o,loading:i,signUp:(e,t)=>c.auth.signUp({email:e,password:t}),signIn:(e,t)=>c.auth.signInWithPassword({email:e,password:t}),signOut:()=>c.auth.signOut()},children:e})},"useAuth",0,()=>(0,r.useContext)(n)])},40710,e=>{"use strict";var t=e.i(43476),r=e.i(46696);e.s(["default",0,function(){return(0,t.jsx)(r.Toaster,{position:"bottom-right",gap:10,toastOptions:{unstyled:!0,classNames:{toast:`
                        flex items-center gap-3
                        w-full
                        rounded-2xl
                        border border-border/50
                        bg-bg-elevated/40
                        backdrop-blur-xl
                        px-4 py-3
                        text-sm font-mono text-fg
                        shadow-2xl
                    `,title:"text-fg font-medium",description:"text-fg-muted text-xs",icon:"text-accent shrink-0",success:"[&_[data-icon]]:text-accent",closeButton:`
                        bg-bg-elevated/60
                        border border-border/50
                        text-fg-muted
                        hover:text-fg
                    `}}})}])}]);