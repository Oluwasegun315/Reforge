"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { localData } from "@/lib/storage";
import { normalizeProfile } from "@/lib/profile";
import {
  notificationsStore,
  pushBrowserNotification,
  requestBrowserPermission,
} from "@/lib/notifications";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { signOutUser } from "@/lib/auth-session";

function SettingsInner() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [notifMessage, setNotifMessage] = useState<string | null>(null);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);

  useEffect(() => {
    const profile = localData.getProfile();
    if (profile) setNotifications(profile.notificationsEnabled);
  }, []);

  const setNotificationsEnabled = async (enabled: boolean) => {
    setNotifMessage(null);
    const profile = localData.getProfile();
    if (!profile) {
      setNotifMessage("Finish your profile first.");
      return;
    }

    if (enabled) {
      const permission = await requestBrowserPermission();
      if (permission === "denied") {
        setNotifications(false);
        localData.saveProfile(
          normalizeProfile({ ...profile, notificationsEnabled: false })
        );
        setNotifMessage("Browser blocked notifications. Allow them in site settings, then try again.");
        return;
      }
      if (permission === "granted") {
        pushBrowserNotification(
          "RepForge reminders on",
          `Training days: ${profile.preferredDays.join(", ") || "set them in Profile"}`
        );
      }
      notificationsStore.syncProfileReminders({
        preferredName: profile.preferredName,
        preferredDays: profile.preferredDays,
        focusAreas: profile.focusAreas,
        sessionMinutes: profile.sessionMinutes,
        notificationsEnabled: true,
      });
    }

    setNotifications(enabled);
    localData.saveProfile(
      normalizeProfile({ ...profile, notificationsEnabled: enabled })
    );
    setNotifMessage(
      enabled
        ? "Reminders ON — you’ll get useful day-of alerts in the bell."
        : "Reminders OFF."
    );
  };

  const sendTest = () => {
    if (!notifications) {
      setNotifMessage("Turn the switch ON first.");
      return;
    }
    const profile = localData.getProfile();
    const first = (profile?.preferredName || "Athlete").split(" ")[0];
    notificationsStore.add({
      kind: "workout",
      title: `Test for ${first}`,
      body: "Bell works. Tap to open your timer and start a short session.",
      detail: "This is a test alert. When reminders are on, similar nudges appear on your training days with a direct link to the timer.",
      href: "/workouts/timer",
    });
    pushBrowserNotification("RepForge test", "Your notification bell is working.");
    setNotifMessage("Test sent — open the bell in the navbar.");
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage("Geolocation is not available in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationMessage(
          `Permission granted (lat ${pos.coords.latitude.toFixed(2)}, lon ${pos.coords.longitude.toFixed(2)}). Nothing is sent to a server in this build.`
        );
      },
      () => {
        setLocationMessage("Location permission denied or unavailable.");
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  };

  const signOut = () => {
    if (loggingOut) return;
    setLoggingOut(true);
    void signOutUser();
    window.location.assign("/");
  };

  const requestDeletion = () => {
    const ok = window.confirm(
      "Delete all RepForge data stored in this browser? This cannot be undone."
    );
    if (!ok) return;
    localData.clearAll();
    notificationsStore.clear();
    setNotifications(false);
    setNotifMessage("Local account data deleted from this browser.");
    router.replace("/");
  };

  return (
    <div className="container-page py-10 md:py-14 max-w-2xl space-y-6">
      <div>
        <p className="section-eyebrow mb-3">Signed-in only</p>
        <h1 className="display-title text-4xl mb-2">Settings</h1>
        <p className="text-[var(--text-muted)] text-sm">
          Control training reminders, optional location, and your account. Appearance (dark/light)
          stays in the navbar toggle.
        </p>
      </div>

      <Card className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-semibold">Training reminders</h2>
              <Badge>{notifications ? "On" : "Off"}</Badge>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              Day-of nudges based on your Profile training days. The bell only appears when you are
              signed in.
            </p>
          </div>
          <ToggleSwitch
            checked={notifications}
            onChange={(v) => void setNotificationsEnabled(v)}
            label="Enable workout notifications"
          />
        </div>
        <Button variant="secondary" onClick={sendTest}>
          Send test notification
        </Button>
        {notifMessage && <p className="text-sm text-[var(--cyan)]">{notifMessage}</p>}
      </Card>

      <Card className="space-y-4">
        <h2 className="font-semibold">Optional location</h2>
        <p className="text-sm text-[var(--text-muted)]">
          Future uses may include local time tips. Never requested automatically.
        </p>
        <Button variant="secondary" onClick={requestLocation}>
          Share location when needed
        </Button>
        {locationMessage && <p className="text-sm text-[var(--text-muted)]">{locationMessage}</p>}
      </Card>

      <Card className="space-y-4">
        <h2 className="font-semibold">Account</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={signOut} disabled={loggingOut}>
            {loggingOut ? "Signing out…" : "Sign out"}
          </Button>
          <Button variant="danger" onClick={requestDeletion}>
            Request account deletion
          </Button>
        </div>
        <p className="text-xs text-[var(--text-dim)]">
          Cloud deletion will use your Supabase account once the backend is connected.
        </p>
      </Card>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <RequireAuth>
      <SettingsInner />
    </RequireAuth>
  );
}
