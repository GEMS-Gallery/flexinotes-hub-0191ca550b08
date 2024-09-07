export const idlFactory = ({ IDL }) => {
  const Position = IDL.Record({ 'x' : IDL.Nat, 'y' : IDL.Nat });
  const Document = IDL.Record({
    'id' : IDL.Text,
    'title' : IDL.Text,
    'content' : IDL.Text,
    'position' : Position,
  });
  const Note = IDL.Record({
    'id' : IDL.Text,
    'content' : IDL.Text,
    'documentId' : IDL.Text,
    'position' : Position,
  });
  const UserData = IDL.Record({
    'documents' : IDL.Vec(Document),
    'notes' : IDL.Vec(Note),
  });
  const Result_1 = IDL.Variant({ 'ok' : UserData, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'getUserData' : IDL.Func([], [Result_1], []),
    'saveUserData' : IDL.Func([IDL.Vec(Document), IDL.Vec(Note)], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
