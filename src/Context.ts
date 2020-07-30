import { createContext } from 'react';
import { GetEditor } from './types';

export default createContext<GetEditor | null>(null);
