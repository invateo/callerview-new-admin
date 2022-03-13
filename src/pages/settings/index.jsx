import React, { useState } from "react";
import Layout from '../../components/layout';

const Settings = () => {
  const [enableReg, setEnableReg] = useState(false); //get value later

  const handleChangeInput = (e) => {
    setEnableReg(el => !el);
  }
  
  const saveSettings = () => {};

    return (
      <Layout title="Settings">
        <>
          <div className="top-bar mt-3">
            <div className="pt-10 pb-4">
              <h2 className="text-2xl text-black font-medium mr-5">
                Dashboard Settings
              </h2>
            </div>
          </div>
          <div className="intro-y box p-5 mt-8 grid grid-cols-12 gap-4 gap-y-3 mt-12 mb-5" style={{zIndex: "0"}}>
                <div className="col-span-12">
                  <h2 className="text-lg text-black font-medium mr-5">
                    Management
                  </h2>
                </div>
                <div className="col-span-12">
                  <div className="mt-2">
                      <div className="form-check form-switch">
                        <label className="mr-10" htmlFor="checkbox-switch-7">
                          Enable User Registration 
                          <span className="text-xs italic text-secondary"> (Turn off to disable)</span>
                        </label>
                        <input 
                          id="checkbox-switch-7"
                          className="form-check-input border-solid border-slate-900"
                          type="checkbox"
                          onChange={handleChangeInput}
                          value={enableReg}
                        />
                      </div>
                  </div>
                </div>

                <div className="col-span-12 border-t mt-5 border-slate-700 pt-5">
                  <div onClick={saveSettings} className="btn btn-primary w-auto">
                    Save Settings
                  </div>
                </div>
          </div>
        </>
      </Layout>
    );
}

export default Settings;
