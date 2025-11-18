import { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { isTauriEnvironment } from "../utils/env";

interface DesktopBridgeOptions {
  onRefresh?: () => void;
  onNavigateHome?: () => void;
}

export const useDesktopBridge = ({ onRefresh, onNavigateHome }: DesktopBridgeOptions) => {
  useEffect(() => {
    if (!isTauriEnvironment()) {
      return undefined;
    }

    const disposePromises: Array<Promise<() => void>> = [];

    if (onRefresh) {
      disposePromises.push(listen("desktop:refresh", onRefresh));
    }

    if (onNavigateHome) {
      disposePromises.push(listen("desktop:navigate-home", onNavigateHome));
    }

    return () => {
      disposePromises.forEach(async (subscription) => {
        const dispose = await subscription;
        dispose();
      });
    };
  }, [onRefresh, onNavigateHome]);
};
