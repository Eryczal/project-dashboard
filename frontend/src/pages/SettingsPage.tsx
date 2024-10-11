import { useRef } from "react";
import Aside from "../components/Aside";
import { useUser } from "../contexts/UserContext";

function SettingsPage() {
    const { user } = useUser();
    const themes = ["light", "glass"];
    const ref = useRef<HTMLSelectElement | null>(null);

    const setTheme = () => {
        if (!ref.current) {
            return;
        }

        for (let i = 0; i < themes.length; i++) {
            if (themes[i] === ref.current.value) {
                document.body.classList.add(themes[i]);
                continue;
            }

            document.body.classList.remove(themes[i]);
        }
    };

    if (!user) {
        return <Aside />;
    }

    return (
        <>
            <div className="settings-container" style={{ display: "flex" }}>
                <Aside />
                <div className="settings-page">
                    Wybierz motyw:
                    <select ref={ref} onChange={setTheme} defaultValue={user.theme}>
                        {themes.map((themeName: string) => {
                            return (
                                <option value={themeName} key={themeName}>
                                    {themeName}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>
        </>
    );
}

export default SettingsPage;
