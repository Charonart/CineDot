/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from 'react';
  import Link from 'next/link';
  import { useLogout } from '../hooks/useLogout';
  import { AuthUser } from '../types/auth.type';
  import { LogOut, Ticket, User, ChevronDown } from 'lucide-react';

  interface UserMenuProps {
    user: AuthUser;
  }

  export const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const logoutMutation = useLogout();

    const handleLogout = () => {
      logoutMutation.mutate();
    };

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    const initials = user.name
      ? user.name
          .split(' ')
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase()
      : 'U';

    return (
      <div className="user-menu-wrapper" ref={dropdownRef}>
        <button
          type="button"
          className="user-menu-trigger"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className="user-avatar-circle">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="user-avatar-img" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <span className="user-trigger-name">{user.name}</span>
          <ChevronDown size={14} className={`user-trigger-chevron ${isOpen ? 'open' : ''}`} />
        </button>

        {isOpen && (
          <div className="user-dropdown-menu">
            <div className="user-dropdown-header">
              <span className="user-dropdown-name">{user.name}</span>
              <span className="user-dropdown-email">{user.email}</span>
            </div>
            
            <div className="user-dropdown-divider"></div>

            <Link href="/profile" className="user-dropdown-item" onClick={() => setIsOpen(false)}>
              <User size={16} />
              <span>Tài khoản của tôi</span>
            </Link>

            <Link href="/tickets" className="user-dropdown-item" onClick={() => setIsOpen(false)}>
              <Ticket size={16} />
              <span>Vé của tôi</span>
            </Link>

            <div className="user-dropdown-divider"></div>

            <button
              type="button"
              className="user-dropdown-item logout-btn"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut size={16} />
              <span>{logoutMutation.isPending ? 'Đang đăng xuất...' : 'Đăng xuất'}</span>
            </button>
          </div>
        )}

        <style dangerouslySetInnerHTML={{ __html: `
          .user-menu-wrapper {
            position: relative;
            display: inline-block;
          }
          .user-menu-trigger {
            display: flex;
            align-items: center;
            gap: 10px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            padding: 6px 14px 6px 8px;
            border-radius: 30px;
            cursor: pointer;
            color: #FFFFFF;
            font-size: 14px;
            font-weight: 600;
            transition: background 0.2s, border-color 0.2s;
          }
          .user-menu-trigger:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.25);
          }
          .user-avatar-circle {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: #FFFFFF;
            font-weight: 700;
            overflow: hidden;
          }
          .user-avatar-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .user-trigger-chevron {
            color: rgba(255, 255, 255, 0.6);
            transition: transform 0.2s;
          }
          .user-trigger-chevron.open {
            transform: rotate(180deg);
          }
          .user-dropdown-menu {
            position: absolute;
            right: 0;
            top: calc(100% + 8px);
            width: 240px;
            background: #FFFFFF;
            border: 1px solid rgba(0, 0, 0, 0.08);
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            z-index: 100;
            overflow: hidden;
            padding: 6px 0;
            animation: fadeIn 0.15s ease-out;
          }
          .user-dropdown-header {
            padding: 12px 16px;
            display: flex;
            flex-direction: column;
            gap: 2px;
          }
          .user-dropdown-name {
            font-size: 14.5px;
            font-weight: 700;
            color: #1A1A1A;
          }
          .user-dropdown-email {
            font-size: 12.5px;
            color: #6C757D;
          }
          .user-dropdown-divider {
            height: 1px;
            background: #E9ECEF;
            margin: 6px 0;
          }
          .user-dropdown-item {
            width: 100%;
            padding: 10px 16px;
            background: none;
            border: none;
            display: flex;
            align-items: center;
            gap: 12px;
            color: #495057;
            font-size: 14px;
            font-weight: 500;
            text-decoration: none;
            cursor: pointer;
            transition: background 0.15s, color 0.15s;
            text-align: left;
            box-sizing: border-box;
          }
          .user-dropdown-item:hover {
            background: #F8F9FA;
            color: #1A1A1A;
          }
          .user-dropdown-item.logout-btn {
            color: #C53030;
          }
          .user-dropdown-item.logout-btn:hover {
            background: #FFF5F5;
            color: #C53030;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-4px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @media (max-width: 768px) {
            .user-trigger-name {
              display: none;
            }
            .user-menu-trigger {
              padding: 4px;
              background: none;
              border: none;
            }
            .user-trigger-chevron {
              display: none;
            }
          }
        `}} />
      </div>
    );
  };
  
