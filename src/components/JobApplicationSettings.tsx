"use client";

import { useState, useEffect } from "react";
import ToggleSwitch from "./ToggleSwitch";
import ConfirmModal from "./ConfirmModal"; // 👈 import

export default function JobApplicationSettings() {
    const [currencies, setCurrencies] = useState<{ [key: string]: string }>({});
    const [localCurrency, setLocalCurrency] = useState("");
    const [convertCurrency, setConvertCurrency] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const fetchInitialSettings = async () => {
            try {
                const res = await fetch("/api/settings/job-application");
                const data = await res.json();
                if (data) {
                    setLocalCurrency(data.localCurrency || "");
                    setConvertCurrency(data.convertCurrency || false);
                }
            } catch {
                setError("Failed to load settings.");
            }
        };

        const fetchCurrencies = async () => {
            try {
                const res = await fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json");
                if (!res.ok) throw new Error("Failed to fetch currency data.");
                const data = await res.json();
                setCurrencies(data);
            } catch {
                setError("Unable to load currencies.");
            } finally {
                setLoading(false);
            }
        };

        fetchInitialSettings();
        fetchCurrencies();
    }, []);

    const saveSettings = async (newCurrency: string, convert: boolean) => {
        setSaving(true);
        try {
            const res = await fetch("/api/settings/job-application", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ localCurrency: newCurrency, convertCurrency: convert })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData?.message || "Save failed.");
            }
        } catch (error: unknown) {
            let message = "Failed to save settings.";
            if (error instanceof Error) {
                message = error.message || message;
            }
            setError(message);
        } finally {
            setSaving(false);
        }
    };

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = e.target.value;

        if (!selected && convertCurrency) {
            // prompt user
            setShowConfirm(true);
            return;
        }

        setLocalCurrency(selected);
        saveSettings(selected, convertCurrency);
    };

    const confirmCurrencyClear = () => {
        setLocalCurrency("");
        setConvertCurrency(false);
        setShowConfirm(false);
        saveSettings("", false);
    };

    const cancelCurrencyClear = () => {
        setShowConfirm(false);
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Job Application Settings</h2>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {loading ? (
                <p className="text-sm text-gray-400">Loading settings...</p>
            ) : (
                <>
                    <div>
                        <label htmlFor="currency" className="block text-sm font-medium mb-1">Set Currency</label>
                        <select
                            id="currency"
                            name="currency"
                            value={localCurrency}
                            onChange={handleCurrencyChange}
                            className="w-full border px-3 py-2 rounded-md shadow-sm bg-black text-white"
                        >
                            <option value="">Select Currency</option>
                            {Object.entries(currencies).map(([code, name]) => (
                                <option key={code} value={code.toUpperCase()}>
                                    {code.toUpperCase()} - {name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <ToggleSwitch
                        label="Convert all salaries to selected currency"
                        checked={convertCurrency}
                        onChange={(checked) => {
                            setConvertCurrency(checked);
                            saveSettings(localCurrency, checked);
                        }}
                        disabled={!localCurrency}
                    />

                    {saving && <p className="text-sm text-gray-400">Saving settings...</p>}
                </>
            )}

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={showConfirm}
                title="Clear Currency?"
                message="You have enabled currency conversion. Do you want to clear the currency and disable conversion?"
                onConfirm={confirmCurrencyClear}
                onCancel={cancelCurrencyClear}
            />
        </div>
    );
}
