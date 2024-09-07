import Hash "mo:base/Hash";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Iter "mo:base/Iter";

actor {
  type Tab = {
    id: Nat;
    title: Text;
    content: ?Text;
  };

  stable var nextId: Nat = 0;
  stable var tabsEntries: [(Nat, Tab)] = [];

  var tabs = HashMap.HashMap<Nat, Tab>(10, Nat.equal, Nat.hash);

  public func createTab(title: Text, content: ?Text) : async Result.Result<Nat, Text> {
    let id = nextId;
    nextId += 1;
    let newTab: Tab = { id; title; content };
    tabs.put(id, newTab);
    #ok(id)
  };

  public query func getTabs() : async [Tab] {
    Array.map<(Nat, Tab), Tab>(Iter.toArray(tabs.entries()), func (entry) { entry.1 })
  };

  public func updateTab(id: Nat, title: Text, content: ?Text) : async Result.Result<(), Text> {
    switch (tabs.get(id)) {
      case (null) { #err("Tab not found") };
      case (?tab) {
        let updatedTab: Tab = { id; title; content };
        tabs.put(id, updatedTab);
        #ok()
      };
    }
  };

  public func deleteTab(id: Nat) : async Result.Result<(), Text> {
    switch (tabs.remove(id)) {
      case (null) { #err("Tab not found") };
      case (?_) { #ok() };
    }
  };

  system func preupgrade() {
    tabsEntries := Iter.toArray(tabs.entries());
  };

  system func postupgrade() {
    tabs := HashMap.fromIter<Nat, Tab>(tabsEntries.vals(), 10, Nat.equal, Nat.hash);
    tabsEntries := [];
  };
}
