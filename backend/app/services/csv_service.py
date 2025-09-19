import pandas as pd
import json
from typing import List, Dict, Any
from io import StringIO, BytesIO
import uuid
import os
from datetime import datetime

class CSVService:
    def __init__(self):
        self.supported_formats = ['.csv', '.xlsx', '.xls', '.json']
    
    def validate_file_format(self, filename: str) -> bool:
        """
        Kiểm tra định dạng file có được hỗ trợ không
        """
        return any(filename.lower().endswith(fmt) for fmt in self.supported_formats)
    
    def read_guests_from_csv(self, file_content: bytes, filename: str) -> List[Dict[str, Any]]:
        """
        Đọc danh sách khách mời từ file CSV/Excel
        """
        try:
            # Xác định định dạng file
            if filename.lower().endswith('.csv'):
                # Đọc CSV
                df = pd.read_csv(StringIO(file_content.decode('utf-8')))
            elif filename.lower().endswith(('.xlsx', '.xls')):
                # Đọc Excel
                df = pd.read_excel(file_content)
            else:
                raise ValueError("Định dạng file không được hỗ trợ")
            
            # Chuyển đổi thành danh sách dictionary
            guests = df.to_dict('records')
            
            # Làm sạch dữ liệu
            cleaned_guests = []
            for guest in guests:
                cleaned_guest = self._clean_guest_data(guest)
                if cleaned_guest:  # Chỉ thêm nếu có dữ liệu hợp lệ
                    cleaned_guests.append(cleaned_guest)
            
            return cleaned_guests
            
        except Exception as e:
            raise ValueError(f"Lỗi đọc file: {str(e)}")
    
    def read_guests_from_json(self, file_content: bytes) -> List[Dict[str, Any]]:
        """
        Đọc danh sách khách mời từ file JSON
        """
        try:
            data = json.loads(file_content.decode('utf-8'))
            if isinstance(data, list):
                return [self._clean_guest_data(guest) for guest in data if self._clean_guest_data(guest)]
            else:
                raise ValueError("File JSON phải chứa danh sách khách mời")
        except Exception as e:
            raise ValueError(f"Lỗi đọc file JSON: {str(e)}")
    
    def _clean_guest_data(self, guest: Dict[str, Any]) -> Dict[str, Any]:
        """
        Làm sạch dữ liệu khách mời
        """
        cleaned = {}
        
        # Mapping các trường có thể có
        field_mapping = {
            'title': ['title', 'danh_xung', 'danh_xưng'],
            'name': ['name', 'ten', 'ho_ten', 'full_name'],
            'role': ['role', 'chuc_vu', 'position', 'vai_tro'],
            'organization': ['organization', 'to_chuc', 'cong_ty', 'company'],
            'tag': ['tag', 'nhan', 'label', 'group'],
            'email': ['email', 'thu_dien_tu'],
            'phone': ['phone', 'dien_thoai', 'sdt', 'phone_number']
        }
        
        # Tìm và map các trường
        for target_field, possible_fields in field_mapping.items():
            value = None
            for field in possible_fields:
                if field in guest and guest[field]:
                    value = str(guest[field]).strip()
                    break
            cleaned[target_field] = value if value else None
        
        # Kiểm tra dữ liệu bắt buộc
        if not cleaned.get('name'):
            return None
        
        # Tạo ID tạm thời nếu chưa có
        if 'id' not in cleaned:
            cleaned['id'] = str(uuid.uuid4())
        
        return cleaned
    
    def _extract_minimal_guest_rows(self, guests: List[Any]) -> List[Dict[str, Any]]:
        """
        Chuẩn hoá danh sách khách mời thành chỉ 3 cột: id, name, organization.
        Hỗ trợ cả dict và SQLAlchemy model (có attribute).
        """
        rows: List[Dict[str, Any]] = []
        for g in guests:
            # Support SQLAlchemy model or dict-like
            try:
                gid = getattr(g, 'id', None) if not isinstance(g, dict) else g.get('id')
                name = getattr(g, 'name', None) if not isinstance(g, dict) else g.get('name')
                org = getattr(g, 'organization', None) if not isinstance(g, dict) else g.get('organization')
            except Exception:
                gid = None
                name = None
                org = None
            rows.append({
                'id': gid if gid is not None else '',
                'name': (name or ''),
                'organization': (org or ''),
            })
        return rows
    
    def export_guests_to_csv(self, guests: List[Dict[str, Any]], filename: str = None) -> str:
        """
        Xuất danh sách khách mời ra file CSV
        """
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"guests_export_{timestamp}.csv"
        
        # Tạo thư mục exports nếu chưa có
        export_dir = "exports"
        if not os.path.exists(export_dir):
            os.makedirs(export_dir)
        
        file_path = os.path.join(export_dir, filename)
        
        # Chỉ xuất 3 cột: id|name|organization, không header, phân cách bằng '|'
        rows = self._extract_minimal_guest_rows(guests)
        df = pd.DataFrame(rows, columns=['id', 'name', 'organization'])
        df.to_csv(file_path, index=False, header=False, sep='|', encoding='utf-8-sig')
        
        return file_path
    
    def export_guests_to_excel(self, guests: List[Dict[str, Any]], filename: str = None) -> str:
        """
        Xuất danh sách khách mời ra file Excel
        """
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"guests_export_{timestamp}.xlsx"
        
        # Tạo thư mục exports nếu chưa có
        export_dir = "exports"
        if not os.path.exists(export_dir):
            os.makedirs(export_dir)
        
        file_path = os.path.join(export_dir, filename)
        
        # Xuất 3 cột: id, name, organization (không header) vào Excel
        rows = self._extract_minimal_guest_rows(guests)
        df = pd.DataFrame(rows, columns=['id', 'name', 'organization'])
        # Dùng engine mặc định (openpyxl) để tránh thiếu dependency trong container
        df.to_excel(file_path, index=False, header=False, sheet_name='Guests')
        
        return file_path
    
    def get_import_template(self) -> str:
        """
        Tạo template CSV để import
        """
        template_data = [
            {
                'title': 'Mr',
                'name': 'Nguyễn Văn A',
                'role': 'CEO',
                'organization': 'Công ty ABC',
                'tag': 'ABC',
                'email': 'nguyenvana@abc.com',
                'phone': '0123456789'
            }
        ]
        
        df = pd.DataFrame(template_data)
        return df.to_csv(index=False, encoding='utf-8-sig')



