import { createContext,useContext,useState,type ReactNode } from 'react'
import type { UserInfo,Role } from '../api'
import { demoUser } from '../demo/engine'
const AuthContext=createContext({user:demoUser as UserInfo|null,loading:false,login:async(_username:string,_password:string):Promise<UserInfo>=>demoUser,register:async(_payload:{email:string;password:string;nickname:string}):Promise<UserInfo>=>demoUser,logout:()=>{},isRole:(...roles:Role[])=>roles.includes('STUDENT')})
export function AuthProvider({children}:{children:ReactNode}){const [user,setUser]=useState<UserInfo|null>(demoUser);return <AuthContext.Provider value={{user,loading:false,async login(){setUser(demoUser);return demoUser},async register(){throw Error('No account is needed for this demo.')},logout(){setUser(null)},isRole:(...roles:Role[])=>!!user&&roles.includes(user.role)}}>{children}</AuthContext.Provider>}
export function useAuth(){return useContext(AuthContext)}
