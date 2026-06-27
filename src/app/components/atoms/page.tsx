'use client';

import React, { useState } from 'react';
import "@/styles/template.css";
import {
  Button,
  DropdownMenu,
  SelectBox,
  SearchAutocomplete,
  ToggleSwitch,
  Accordion,
  TabGroup,
  RadioCardGroup,
  BaseDialog,
  BaseTransition,
} from '@/shared/components/atoms';
import { Bell, CreditCard, LogOut, Settings, User } from 'lucide-react';

export default function AtomsShowcasePage() {
  // State for SelectBox
  const selectOptions = [
    { id: 1, name: 'Hồ Chí Minh' },
    { id: 2, name: 'Hà Nội' },
    { id: 3, name: 'Đà Nẵng', disabled: true },
  ];
  const [selectedCity, setSelectedCity] = useState(selectOptions[0]);

  // State for Autocomplete
  const autocompleteOptions = [
    { id: 1, name: 'Inception' },
    { id: 2, name: 'Interstellar' },
    { id: 3, name: 'The Dark Knight' },
    { id: 4, name: 'Oppenheimer' },
  ];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const filteredOptions =
    searchQuery === ''
      ? autocompleteOptions
      : autocompleteOptions.filter((option) =>
          option.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

  // State for Toggles
  const [toggle1, setToggle1] = useState(false);
  const [toggle2, setToggle2] = useState(true);

  // State for Radio Group
  const paymentOptions = [
    { value: 'momo', title: 'Ví MoMo', description: 'Thanh toán qua ví điện tử MoMo' },
    { value: 'zalo', title: 'ZaloPay', description: 'Thanh toán qua ZaloPay' },
    { value: 'card', title: 'Thẻ tín dụng', description: 'Visa / Mastercard', disabled: true },
  ];
  const [selectedPayment, setSelectedPayment] = useState(paymentOptions[0].value);

  // State for Dialog
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState<'sm' | 'md' | 'lg' | 'cinematic'>('md');

  // State for Transition
  const [showTransition, setShowTransition] = useState(true);

  // Data for Dropdown
  const dropdownItems = [
    { label: 'Profile', icon: <User />, onClick: () => alert('Profile clicked') },
    { label: 'Settings', icon: <Settings /> },
    { label: 'Disabled Item', icon: <Bell />, disabled: true },
    { label: 'Logout', icon: <LogOut />, danger: true, onClick: () => alert('Logout clicked') },
  ];

  // Data for Accordion
  const accordionItems = [
    { id: 1, title: 'What is CineDot?', content: 'CineDot is a modern cinema booking system.' },
    { id: 2, title: 'How to buy tickets?', content: 'You can buy tickets directly from the movie detail page.' },
    { id: 3, title: 'Can I refund?', content: 'Refund policies apply within 24 hours of booking.' },
  ];

  // Data for Tabs
  const tabItems = [
    { id: 1, label: 'Lịch chiếu', content: <div className="p-4 bg-zinc-800/50 rounded-lg text-sm text-zinc-300">Nội dung tab Lịch chiếu</div> },
    { id: 2, label: 'Đánh giá', content: <div className="p-4 bg-zinc-800/50 rounded-lg text-sm text-zinc-300">Nội dung tab Đánh giá</div> },
    { id: 3, label: 'Thông tin phim', content: <div className="p-4 bg-zinc-800/50 rounded-lg text-sm text-zinc-300">Nội dung tab Thông tin phim</div> },
  ];

  // Render a section block
  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-12 border border-zinc-800 bg-zinc-900/30 rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-white mb-6 pb-2 border-b border-zinc-800">{title}</h2>
      <div className="space-y-8">{children}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-8 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-4">Atoms Components Showcase</h1>
          <p className="text-zinc-400">Danh sách các Headless UI Atoms với các variants (variables) khác nhau.</p>
        </div>

        <Section title="1. Button & BaseDialog (Modal)">
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => { setModalSize('sm'); setIsModalOpen(true); }}>
              Open Small Modal
            </Button>
            <Button onClick={() => { setModalSize('md'); setIsModalOpen(true); }}>
              Open Medium Modal
            </Button>
            <Button onClick={() => { setModalSize('cinematic'); setIsModalOpen(true); }} className="bg-red-600 data-hover:bg-red-500 data-active:bg-red-700">
              Open Cinematic Modal
            </Button>
            <Button disabled>
              Disabled Button
            </Button>
          </div>

          <BaseDialog
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Ví dụ Modal"
            size={modalSize}
          >
            <div className="text-zinc-300">
              <p>Đây là nội dung của modal. Kích thước hiện tại: <strong>{modalSize}</strong></p>
              {modalSize === 'cinematic' && (
                <div className="mt-4 aspect-video bg-zinc-800 rounded-lg flex items-center justify-center">
                  <span className="text-zinc-500 text-lg">Video Player Area</span>
                </div>
              )}
              <div className="mt-6 flex justify-end gap-3">
                <Button onClick={() => setIsModalOpen(false)} className="bg-zinc-700 data-hover:bg-zinc-600 data-active:bg-zinc-800 text-white">
                  Đóng
                </Button>
                <Button onClick={() => setIsModalOpen(false)} className="bg-red-600 data-hover:bg-red-500 data-active:bg-red-700">
                  Xác nhận
                </Button>
              </div>
            </div>
          </BaseDialog>
        </Section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Section title="2. DropdownMenu">
            <div className="flex items-center gap-10">
              <div>
                <p className="text-sm text-zinc-400 mb-3">Vị trí: bottom-right (Mặc định)</p>
                <DropdownMenu
                  items={dropdownItems}
                  trigger={
                    <Button>
                      Menu Tùy chọn 1
                    </Button>
                  }
                />
              </div>
              <div>
                <p className="text-sm text-zinc-400 mb-3">Vị trí: bottom-left</p>
                <DropdownMenu
                  placement="bottom-left"
                  items={dropdownItems}
                  trigger={
                    <Button className="flex items-center gap-2">
                      <User className="h-4 w-4" /> Menu Tùy chọn 2
                    </Button>
                  }
                />
              </div>
            </div>
          </Section>

          <Section title="3. SelectBox (Listbox)">
            <div className="space-y-6">
              <div>
                <p className="text-sm text-zinc-400 mb-2">Variant: solid (Mặc định)</p>
                <SelectBox
                  options={selectOptions}
                  value={selectedCity}
                  onChange={setSelectedCity}
                />
              </div>
              <div>
                <p className="text-sm text-zinc-400 mb-2">Variant: outline</p>
                <SelectBox
                  options={selectOptions}
                  value={selectedCity}
                  onChange={setSelectedCity}
                  variant="outline"
                />
              </div>
              <div>
                <p className="text-sm text-zinc-400 mb-2">Trạng thái: disabled</p>
                <SelectBox
                  options={selectOptions}
                  value={selectedCity}
                  onChange={setSelectedCity}
                  disabled
                />
              </div>
            </div>
          </Section>
        </div>

        <Section title="4. SearchAutocomplete (Combobox)">
          <div className="max-w-md">
            <p className="text-sm text-zinc-400 mb-2">Tìm kiếm có gợi ý</p>
            <SearchAutocomplete
              options={filteredOptions}
              value={selectedMovie}
              onChange={setSelectedMovie}
              query={searchQuery}
              setQuery={setSearchQuery}
              placeholder="Tìm tên phim (ví dụ: in)..."
            />
            {selectedMovie && (
              <p className="mt-3 text-sm text-green-400">Đã chọn: {selectedMovie.name}</p>
            )}
          </div>
        </Section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Section title="5. ToggleSwitch">
            <div className="space-y-6">
              <div className="flex gap-8">
                <div>
                  <p className="text-sm text-zinc-400 mb-3">Size: sm</p>
                  <ToggleSwitch checked={toggle1} onChange={setToggle1} size="sm" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400 mb-3">Size: md</p>
                  <ToggleSwitch checked={toggle1} onChange={setToggle1} size="md" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400 mb-3">Size: lg</p>
                  <ToggleSwitch checked={toggle1} onChange={setToggle1} size="lg" />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800">
                <p className="text-sm text-zinc-400 mb-3">Kèm Label & Description</p>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <ToggleSwitch
                    checked={toggle2}
                    onChange={setToggle2}
                    label="Nhận thông báo qua email"
                    description="Chúng tôi sẽ gửi email khi có phim mới."
                  />
                </div>
              </div>

              <div>
                <p className="text-sm text-zinc-400 mb-3">Disabled</p>
                <ToggleSwitch checked={true} onChange={() => {}} disabled label="Bắt buộc đồng ý điều khoản" />
              </div>
            </div>
          </Section>

          <Section title="6. Accordion (Disclosure)">
            <div className="space-y-8">
              <div>
                <p className="text-sm text-zinc-400 mb-3">Variant: separated</p>
                <Accordion items={accordionItems} variant="separated" defaultOpenIndex={0} />
              </div>
              <div>
                <p className="text-sm text-zinc-400 mb-3">Variant: grouped</p>
                <Accordion items={accordionItems} variant="grouped" />
              </div>
            </div>
          </Section>
        </div>

        <Section title="7. TabGroup">
          <div className="space-y-8">
            <div>
              <p className="text-sm text-zinc-400 mb-3">Variant: underline</p>
              <TabGroup tabs={tabItems} variant="underline" />
            </div>
            <div>
              <p className="text-sm text-zinc-400 mb-3">Variant: pills</p>
              <TabGroup tabs={tabItems} variant="pills" />
            </div>
          </div>
        </Section>

        <Section title="8. RadioCardGroup">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-zinc-400 mb-3">Style: card (Vertical)</p>
              <RadioCardGroup
                options={paymentOptions}
                value={selectedPayment}
                onChange={setSelectedPayment}
                orientation="vertical"
                cardStyle={true}
              />
            </div>
            <div>
              <p className="text-sm text-zinc-400 mb-3">Style: basic (Vertical)</p>
              <div className="bg-zinc-900/50 rounded-xl border border-white/10 p-4">
                <RadioCardGroup
                  options={paymentOptions}
                  value={selectedPayment}
                  onChange={setSelectedPayment}
                  orientation="vertical"
                  cardStyle={false}
                />
              </div>
            </div>
          </div>
        </Section>

        <Section title="9. BaseTransition">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <ToggleSwitch
                checked={showTransition}
                onChange={setShowTransition}
                label="Bật/Tắt Khối dưới đây"
                description="Khối sẽ sử dụng hiệu ứng pop"
              />
            </div>
            
            <div className="h-32">
              <BaseTransition show={showTransition} animation="pop">
                <div className="bg-gradient-to-r from-sky-600 to-sky-900 rounded-xl p-6 shadow-lg shadow-sky-500/20 text-white flex items-center justify-center">
                  <p className="text-lg font-bold">Đây là khối được bọc bởi BaseTransition (Pop Animation)</p>
                </div>
              </BaseTransition>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
