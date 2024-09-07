import Hash "mo:base/Hash";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";

actor {
  type UserData = {
    documents: [Document];
    notes: [Note];
  };

  type Document = {
    id: Text;
    title: Text;
    content: Text;
    position: Position;
  };

  type Note = {
    id: Text;
    content: Text;
    position: Position;
    documentId: Text;
  };

  type Position = {
    x: Nat;
    y: Nat;
  };

  stable var userDataEntries: [(Principal, UserData)] = [];
  var userData = HashMap.HashMap<Principal, UserData>(10, Principal.equal, Principal.hash);

  public shared(msg) func saveUserData(documents: [Document], notes: [Note]) : async Result.Result<(), Text> {
    let caller = msg.caller;
    let data: UserData = {
      documents = documents;
      notes = notes;
    };
    userData.put(caller, data);
    #ok()
  };

  public shared(msg) func getUserData() : async Result.Result<UserData, Text> {
    let caller = msg.caller;
    switch (userData.get(caller)) {
      case (null) { #err("No data found for user") };
      case (?data) { #ok(data) };
    }
  };

  system func preupgrade() {
    userDataEntries := Iter.toArray(userData.entries());
  };

  system func postupgrade() {
    userData := HashMap.fromIter<Principal, UserData>(userDataEntries.vals(), 10, Principal.equal, Principal.hash);
    userDataEntries := [];
  };
}
