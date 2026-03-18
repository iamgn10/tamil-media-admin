import { ILogo } from "../../models/logo.model";

        
export interface IDashboardRepository {
    saveLogo(dashboard: Partial<ILogo>): Promise<ILogo>;
    getLogos(): Promise<ILogo[]>;
    deleteLogosByType(type: 'header' | 'footer'): Promise<void>;
    
}