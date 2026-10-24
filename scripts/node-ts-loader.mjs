import {registerHooks} from 'node:module';
registerHooks({resolve(specifier,context,next){try{return next(specifier,context);}catch(error){if(specifier.startsWith('next/')){try{return next(specifier+'.js',context);}catch{}}if(specifier.startsWith('.')&&!/\.[a-z]+$/i.test(specifier)){for(const ext of ['.ts','.mjs','.js']){try{return next(specifier+ext,context);}catch{}}}throw error;}}});
