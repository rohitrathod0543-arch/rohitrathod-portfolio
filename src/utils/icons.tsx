import React from 'react';
import {
  FileCode2,
  Palette,
  Layout,
  Code2,
  Database,
  Server,
  Globe,
  Cpu,
  Layers,
  Terminal,
  Sparkles,
  ExternalLink,
  Github,
  Mail,
  GraduationCap,
  Briefcase,
  Award,
  FileText,
  User,
  Settings,
  Shield,
  CheckCircle2,
  Clock,
  Send,
  Eye,
  Trash2,
  Edit,
  Plus,
  RefreshCw,
  LogOut,
  AlertCircle,
  Download,
  Search,
  Filter,
  Check,
  X,
  Menu,
  ChevronRight,
  Code,
  BookOpen,
  ArrowUpRight,
  Building2,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  ArrowUp,
  Key,
  Save,
  Copy,
  Lock,
  ArrowLeft,
  Upload,
  EyeOff,
  Compass,
  Target,
} from 'lucide-react';

export const getSkillIcon = (name: string, iconName?: string, className = 'w-5 h-5') => {
  const normalizedIcon = (iconName || name).toLowerCase();

  if (normalizedIcon.includes('html') || iconName === 'FileCode2') {
    return <FileCode2 className={className} />;
  }
  if (normalizedIcon.includes('css') || iconName === 'Palette') {
    return <Palette className={className} />;
  }
  if (normalizedIcon.includes('bootstrap') || iconName === 'Layout') {
    return <Layout className={className} />;
  }
  if (normalizedIcon.includes('script') || normalizedIcon.includes('js') || iconName === 'Code2') {
    return <Code2 className={className} />;
  }
  if (normalizedIcon.includes('database') || normalizedIcon.includes('sql') || iconName === 'Database') {
    return <Database className={className} />;
  }
  if (normalizedIcon.includes('server') || normalizedIcon.includes('node') || iconName === 'Server') {
    return <Server className={className} />;
  }
  if (normalizedIcon.includes('react') || iconName === 'Cpu') {
    return <Cpu className={className} />;
  }
  return <Code className={className} />;
};

export {
  FileCode2,
  Palette,
  Layout,
  Code2,
  Database,
  Server,
  Globe,
  Cpu,
  Layers,
  Terminal,
  Sparkles,
  ExternalLink,
  Github,
  Mail,
  GraduationCap,
  Briefcase,
  Award,
  FileText,
  User,
  Settings,
  Shield,
  CheckCircle2,
  Clock,
  Send,
  Eye,
  Trash2,
  Edit,
  Plus,
  RefreshCw,
  LogOut,
  AlertCircle,
  Download,
  Search,
  Filter,
  Check,
  X,
  Menu,
  ChevronRight,
  Code,
  BookOpen,
  ArrowUpRight,
  Building2,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  ArrowUp,
  Key,
  Save,
  Copy,
  Lock,
  ArrowLeft,
  Upload,
  EyeOff,
  Compass,
  Target,
};
