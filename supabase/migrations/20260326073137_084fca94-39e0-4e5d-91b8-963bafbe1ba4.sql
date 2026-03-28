
-- CREATE OR REPLACE FUNCTION public.handle_new_user()
-- RETURNS trigger
-- LANGUAGE plpgsql
-- SECURITY DEFINER
-- SET search_path TO 'public'
-- AS $function$
-- BEGIN
--   INSERT INTO public.profiles (user_id, display_name)
--   VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  
--   IF (SELECT COUNT(*) FROM public.user_roles) = 0 THEN
--     INSERT INTO public.user_roles (user_id, role)
--     VALUES (NEW.id, 'admin');
--   ELSE
--     INSERT INTO public.user_roles (user_id, role)
--     VALUES (NEW.id, 'user');
--   END IF;
  
--   RETURN NEW;
-- END;
-- $function$;

-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();





-- ================================
-- 🔐 ROLE CHECK FUNCTION
-- ================================

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
SELECT EXISTS (
SELECT 1 FROM public.user_roles
WHERE user_id = _user_id AND role = _role
);
$$;

-- ================================
-- 👤 AUTO USER SETUP
-- ================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
INSERT INTO public.profiles (user_id, display_name)
VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));

IF (SELECT COUNT(*) FROM public.user_roles) = 0 THEN
INSERT INTO public.user_roles (user_id, role)
VALUES (NEW.id, 'admin');
ELSE
INSERT INTO public.user_roles (user_id, role)
VALUES (NEW.id, 'user');
END IF;

RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ================================
-- ⏱ UPDATED_AT TRIGGER
-- ================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
