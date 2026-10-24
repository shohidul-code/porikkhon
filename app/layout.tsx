import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Porikkhon — Your next step, prepared.',description:'A calmer way to prepare. Discover model tests, build a daily practice habit, and turn your progress into confidence.',icons:{icon:'/favicon.svg'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
