import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : bigint } |
  { 'err' : string };
export interface Tab {
  'id' : bigint,
  'title' : string,
  'content' : [] | [string],
}
export interface _SERVICE {
  'createTab' : ActorMethod<[string, [] | [string]], Result_1>,
  'deleteTab' : ActorMethod<[bigint], Result>,
  'getTabs' : ActorMethod<[], Array<Tab>>,
  'updateTab' : ActorMethod<[bigint, string, [] | [string]], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
