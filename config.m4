dnl macOS requires hiredis v1.2.0
AC_CANONICAL_HOST
case "$host_os" in
  darwin*)
    HIREDIS_REQ_VERSION="1.2.0"
    ;;
  *)
    HIREDIS_REQ_VERSION="1.1.0"
    ;;
esac

dnl hiredis
PKG_CHECK_MODULES([HIREDIS], [hiredis >= $HIREDIS_REQ_VERSION])

dnl hiredis_ssl
PKG_CHECK_MODULES([HIREDIS_SSL], [hiredis_ssl >= $HIREDIS_REQ_VERSION])

dnl openssl
PKG_CHECK_MODULES([OPENSSL], [openssl >= 1.1.0])

dnl libck
PKG_CHECK_MODULES([CK], [ck >= 0.7.0])

dnl download url
AC_DEFUN([RELAY_SET_DOWNLOAD_URL], [
  AC_REQUIRE([AC_CANONICAL_HOST])dnl
  AC_REQUIRE([AC_PROG_EGREP])dnl
  AC_REQUIRE([AC_PROG_SED])dnl
  AC_REQUIRE([PKG_PROG_PKG_CONFIG])dnl

  case "$host_os" in
    linux*)
      AC_CHECK_FILE([/etc/os-release], [
        AC_MSG_NOTICE([Extracting OS and version from /etc/os-release])
        VERSION=$($EGREP '^VERSION_ID=' /etc/os-release | $SED 's/VERSION_ID=//')
        ID=$($EGREP '^ID=' /etc/os-release | $SED 's/ID=//' | cut -d . -f -1)
        case $ID in
          alpine|debian)
            OS=$ID
            ;;
          centos|rocky)
            OS=el$VERSION
            ;;
          *)
            AC_MSG_ERROR([unsupported OS $ID, please report on GitHub])
            ;;
        esac
      ], [
        AC_MSG_ERROR([failed to determine OS, please report on GitHub])
      ])
      ;;
    darwin*)
      OS="darwin"
      ;;
    *)
      AC_MSG_ERROR([unsupported OS])
      ;;
  esac

  VERSION=$($PHP_CONFIG --version | cut -d . -f -2)
  PLATFORM=$(echo $host_cpu | $SED 's/aarch64/arm64/;s/x86_64/x86-64/')
  RELAY_DOWNLOAD_URL="https://builds.r2.relay.so/v$1/relay-v$1-php$VERSION-$OS-$PLATFORM.tar.gz"
  PHP_SUBST([RELAY_DOWNLOAD_URL])
  PHP_SUBST([PHP_CONFIG])
])dnl

dnl tools
AC_PATH_PROG([TAR], [tar])
if ! test -x $TAR; then
  AC_MSG_ERROR([tar required])
fi

AC_PATH_PROG([CURL], [curl])
if ! test -x $CURL; then
  AC_MSG_ERROR([curl required])
fi

PHP_NEW_EXTENSION([relay])
RELAY_SET_DOWNLOAD_URL([0.9.0])
PHP_MODULES="$PHP_MODULES \$(PHP_PECL_EXTENSION)"
PHP_ADD_MAKEFILE_FRAGMENT([Makefile.frag])
