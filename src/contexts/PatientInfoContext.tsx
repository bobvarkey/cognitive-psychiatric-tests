import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface PatientInfo {
  name: string;
  id: string;
}

interface PatientInfoContextType {
  patientInfo: PatientInfo;
  setPatientInfo: (info: PatientInfo) => void;
  clearPatientInfo: () => void;
  getPatientInfoForReport: () => Record<string, string> | undefined;
}

const defaultInfo: PatientInfo = { name: '', id: '' };

const PatientInfoContext = createContext<PatientInfoContextType>({
  patientInfo: defaultInfo,
  setPatientInfo: () => {},
  clearPatientInfo: () => {},
  getPatientInfoForReport: () => undefined,
});

export const usePatientInfo = () => useContext(PatientInfoContext);

export const PatientInfoProvider = ({ children }: { children: ReactNode }) => {
  const [patientInfo, setPatientInfo] = useState<PatientInfo>(defaultInfo);

  const clearPatientInfo = useCallback(() => setPatientInfo(defaultInfo), []);

  const getPatientInfoForReport = useCallback(() => {
    const entries: Record<string, string> = {};
    if (patientInfo.name.trim()) entries['Patient Name'] = patientInfo.name.trim();
    if (patientInfo.id.trim()) entries['Patient ID'] = patientInfo.id.trim();
    return Object.keys(entries).length > 0 ? entries : undefined;
  }, [patientInfo]);

  return (
    <PatientInfoContext.Provider value={{ patientInfo, setPatientInfo, clearPatientInfo, getPatientInfoForReport }}>
      {children}
    </PatientInfoContext.Provider>
  );
};
