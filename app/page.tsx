import Porikkhon from './Porikkhon';
import { EXAMS } from '../lib/questions';
export const dynamic='force-dynamic';
export default function Page(){return <Porikkhon initialCatalog={EXAMS}/>;}
