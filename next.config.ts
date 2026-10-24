import type {NextConfig} from 'next';
const config:NextConfig={poweredByHeader:false,allowedDevOrigins:['terminal.local'],reactStrictMode:true,serverExternalPackages:['docx'],outputFileTracingIncludes:{'/api/review':['./public/fonts/*.ttf']},experimental:{proxyClientMaxBodySize:'64kb'},async headers(){return [{source:'/api/:path*',headers:[{key:'Cache-Control',value:'private, no-store'},{key:'X-Content-Type-Options',value:'nosniff'}]}];}};
export default config;
