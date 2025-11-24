'use client';

import { useState } from 'react';

interface LeftSidebarProps {
  onAddElement: (element: any) => void;
  onLoadTemplate?: (templateId: string) => void;
}

export default function LeftSidebar({ onAddElement, onLoadTemplate }: LeftSidebarProps) {
  return <div>Left Sidebar</div>;
}
