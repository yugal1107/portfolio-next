"use client";

import { useEffect, useState } from "react";
import {
  getAdminMe,
  getAdminSkillGroups,
  createAdminSkillGroup,
  deleteAdminSkillGroup,
  createAdminSkill,
  deleteAdminSkill,
} from "@/lib/api/admin";
import Link from "next/link";

interface Skill {
  id: number;
  name: string;
  iconKey: string | null;
  orderIndex: number;
  isPublished: boolean;
}

interface SkillGroup {
  id: number;
  name: string;
  orderIndex: number;
  isPublished: boolean;
  skills: Skill[];
}

export default function SkillsAdminPage() {
  const [groups, setGroups] = useState<SkillGroup[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newGroupName, setNewGroupName] = useState("");
  const [newSkillName, setNewSkillName] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  useEffect(() => {
    getAdminMe()
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      getAdminSkillGroups().then((data) => {
        if (Array.isArray(data)) setGroups(data);
      }).catch(() => {});
    }
  }, [isAuthenticated]);

  const handleAddGroup = async () => {
    if (!newGroupName.trim()) return;
    try {
      const result = await createAdminSkillGroup({
        name: newGroupName,
        orderIndex: groups.length,
        isPublished: true,
      });
      if (result.success) {
        setNewGroupName("");
        getAdminSkillGroups().then((data) => {
          if (Array.isArray(data)) setGroups(data);
        });
      }
    } catch { /* ignore */ }
  };

  const handleDeleteGroup = async (id: number) => {
    if (!confirm("Delete group and all its skills?")) return;
    try {
      await deleteAdminSkillGroup(id);
      setGroups((prev) => prev.filter((g) => g.id !== id));
    } catch { /* ignore */ }
  };

  const handleAddSkill = async (groupId: number) => {
    if (!newSkillName.trim()) return;
    try {
      const result = await createAdminSkill({
        skillGroupId: groupId,
        name: newSkillName,
        orderIndex: 0,
        isPublished: true,
      });
      if (result.success) {
        setNewSkillName("");
        setSelectedGroupId(null);
        getAdminSkillGroups().then((data) => {
          if (Array.isArray(data)) setGroups(data);
        });
      }
    } catch { /* ignore */ }
  };

  const handleDeleteSkill = async (groupId: number, skillId: number) => {
    try {
      await deleteAdminSkill(skillId);
      setGroups((prev) =>
        prev.map((g) =>
          g.id === groupId
            ? { ...g, skills: g.skills.filter((s) => s.id !== skillId) }
            : g
        )
      );
    } catch { /* ignore */ }
  };

  if (isLoading) return <div className="p-8 text-zinc-400">Loading...</div>;
  if (!isAuthenticated) return <div className="p-8 text-zinc-400">Please <Link href="/admin/login">login</Link> first.</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Skills</h1>
        <Link href="/admin" className="text-zinc-400 hover:text-zinc-200">← Back</Link>
      </header>
      <div className="max-w-4xl space-y-6">
        <section className="border border-zinc-700 rounded p-4">
          <h2 className="text-lg font-medium mb-4">Add Skill Group</h2>
          <div className="flex gap-2">
            <input
              placeholder="Group Name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 flex-1"
            />
            <button
              onClick={handleAddGroup}
              className="bg-zinc-800 px-4 py-2 rounded hover:bg-zinc-700"
            >
              Add Group
            </button>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-medium mb-4">Skill Groups</h2>
          <div className="space-y-4">
            {groups.map((group) => (
              <div key={group.id} className="border border-zinc-700 rounded p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium">{group.name}</span>
                  <button
                    onClick={() => handleDeleteGroup(group.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete Group
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {group.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="bg-zinc-800 px-2 py-1 rounded text-sm flex items-center gap-2"
                    >
                      {skill.name}
                      <button
                        onClick={() => handleDeleteSkill(group.id, skill.id)}
                        className="text-zinc-500 hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {group.skills.length === 0 && (
                    <span className="text-zinc-500 text-sm">No skills</span>
                  )}
                </div>
                {selectedGroupId === group.id ? (
                  <div className="flex gap-2">
                    <input
                      placeholder="Skill Name"
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm flex-1"
                    />
                    <button
                      onClick={() => handleAddSkill(group.id)}
                      className="bg-zinc-700 px-2 py-1 rounded text-sm"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setSelectedGroupId(null);
                        setNewSkillName("");
                      }}
                      className="text-zinc-500 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedGroupId(group.id)}
                    className="text-zinc-400 hover:text-zinc-200 text-sm"
                  >
                    + Add Skill
                  </button>
                )}
              </div>
            ))}
            {groups.length === 0 && <p className="text-zinc-500">No skill groups yet.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}