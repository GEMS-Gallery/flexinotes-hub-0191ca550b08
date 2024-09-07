import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Document {
  'id' : string,
  'title' : string,
  'content' : string,
  'position' : Position,
}
export interface Note {
  'id' : string,
  'content' : string,
  'documentId' : string,
  'position' : Position,
}
export interface Position { 'x' : bigint, 'y' : bigint }
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : UserData } |
  { 'err' : string };
export interface UserData {
  'documents' : Array<Document>,
  'notes' : Array<Note>,
}
export interface _SERVICE {
  'getUserData' : ActorMethod<[], Result_1>,
  'saveUserData' : ActorMethod<[Array<Document>, Array<Note>], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
