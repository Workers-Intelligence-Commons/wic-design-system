import type * as React from 'react';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary' | 'ink' | 'quiet' }
export declare function Button(props: ButtonProps): React.ReactElement;
export interface BadgeProps { status?: 'admitted' | 'refused' | 'pending' | 'license' | 'neutral'; children?: React.ReactNode }
export declare function Badge(props: BadgeProps): React.ReactElement;
export interface SloganProps { kicker?: string; tone?: 'red' | 'ink'; children: string }
export declare function Slogan(props: SloganProps): React.ReactElement;
export interface NoticeProps { title?: string; children: React.ReactNode }
export declare function Notice(props: NoticeProps): React.ReactElement;
export interface SourceCardProps { name: string; status?: 'admitted' | 'refused' | 'pending'; license?: string; credit?: string; revision?: string; checksum?: string; decidedBy?: string }
export declare function SourceCard(props: SourceCardProps): React.ReactElement;
declare global { interface Window { WIC: { Button: typeof Button; Badge: typeof Badge; Slogan: typeof Slogan; Notice: typeof Notice; SourceCard: typeof SourceCard } } }
