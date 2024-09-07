export const idlFactory = ({ IDL }) => {
  const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Tab = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'content' : IDL.Opt(IDL.Text),
  });
  return IDL.Service({
    'createTab' : IDL.Func([IDL.Text, IDL.Opt(IDL.Text)], [Result_1], []),
    'deleteTab' : IDL.Func([IDL.Nat], [Result], []),
    'getTabs' : IDL.Func([], [IDL.Vec(Tab)], ['query']),
    'updateTab' : IDL.Func(
        [IDL.Nat, IDL.Text, IDL.Opt(IDL.Text)],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
